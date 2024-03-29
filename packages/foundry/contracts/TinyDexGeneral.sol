//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * 
 * @author Formula Zero
 */
contract TinyDex {
    // State Variables
    address public owner;
    mapping(address => mapping(address => uint256)) public tokenCaps;
    mapping(address => mapping(address => uint256)) public tokenBalances;
    mapping(address => mapping(address => address[])) public tokenToUsers;
    mapping(address => mapping(address => mapping(address => uint256))) public userTokenBalances;


    event SwapExecuted(
        address indexed swapExecutor,
        address tokenFrom,
        address tokenTo,
        uint256 valueFrom,
        uint256 valueTo
    );

    event DepositMade(
        address indexed depositor, 
        address indexed tokenFrom,
        address indexed tokenTo, 
        uint256 amount
    );

    // Constructor: Called once on contract deployment
    // Check packages/foundry/deploy/Deploy.s.sol
    constructor(address _owner) {
        owner = _owner;
        tokenCaps[address(USDC)][address(ETH)] = 1000;
    }

    // Modifier: used to define a set of rules that must be met before or after a function is executed
    // Check the withdraw() function
    modifier onlyOwner() {
        // msg.sender: predefined variable that represents address of the account that called the current function
        require(msg.sender == owner, "Not the Owner");
        _;
    }

    function updateCaps(address _tokenFrom, address _tokenTo, uint256 _newTokenCap) onlyOwner external {
        tokenCaps[_tokenFrom][_tokenTo] = _newTokenCap;
    }

    function deposit(address _tokenFrom, address _tokenTo, uint256 _amount, Permit calldata _signature) public {
        require(_amount > 0, "Amount must be greater than 0");
        
        IERC20Permit(token).permit(
            _signature.owner,
            address(this),
            _signature.amount,
            _signature.deadline,
            _signature.v,
            _signature.r,
            _signature.s
        );

        IERC20(token).safeTransferFrom(_signature.owner, address(this), _amount);
    
        tokenBalances[_tokenFrom][_tokenTo] += _amount;
        userTokenBalances[_signature.owner][_tokenFrom][_tokenTo] += _amount;
        tokenToUsers[_tokenFrom][_tokenTo].push(_signature.owner);

        emit DepositMade(_signature.owner, _tokenFrom, _tokenTo, _amount);
    }

    function swap(address _tokenFrom, address _tokenTo) public {
        require(tokenBalances[_tokenFrom][_tokenTo] >= tokenCaps[_tokenFrom][_tokenTo], "Cap not reached yet");

        // Swap logic here ...
        

        tokenBalances[_tokenFrom][_tokenTo] = 0;

        for (uint256 i = 0; i < tokenToUsers[_tokenFrom][_tokenTo].length; i++) {
            uint256 amount = amount * (100 * userTokenBalances[tokenToUsers[_tokenFrom][_tokenTo][i]][_tokenFrom][_tokenTo]) / tokenCaps[_tokenFrom][_tokenTo];
            IERC20(_tokenTo).safeTransferFrom(address(this), tokenToUsers[_tokenFrom][_tokenTo][i], _amount);
            userTokenBalances[tokenToUsers[_tokenFrom][_tokenTo][i]][_tokenFrom][_tokenTo] = 0;
        }

        emit SwapExecuted(msg.sender, token, address(USDC), _amount, _amount);
    }

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}
}
