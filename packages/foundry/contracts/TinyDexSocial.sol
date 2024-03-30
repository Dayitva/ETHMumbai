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
contract TinyDexSocial {
    // State Variables
    address public owner;
    mapping(address => uint256) public tokenCaps;
    mapping(address => uint256) public tokenBalances;
    mapping(address => mapping(address => uint256)) public userTokenBalances;
    mapping(address => address[]) public tokenToUsers;

    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    event SwapExecuted(
        address indexed swapExecutor,
        address tokenFrom,
        address tokenTo,
        uint256 valueFrom,
        uint256 valueTo
    );

    event DepositMade(
        address indexed owner, 
        address indexed token, 
        uint256 amount
    );

    event CapReached(
        address indexed token
    );

    // Constructor: Called once on contract deployment
    // Check packages/foundry/deploy/Deploy.s.sol
    constructor(address _owner) {
        owner = _owner;
        tokenCaps[USDC] = 1000;
        tokenCaps[DAI] = 1000;
    }

    // Modifier: used to define a set of rules that must be met before or after a function is executed
    // Check the withdraw() function
    modifier onlyOwner() {
        // msg.sender: predefined variable that represents address of the account that called the current function
        require(msg.sender == owner, "Not the Owner");
        _;
    }

    function updateCaps(address _token, uint256 _amount) onlyOwner public {
        tokenCaps[_token] = _amount;
    }

    function deposit(address token, uint256 _amount, uint256 _deadline, uint8 v, bytes32 r, bytes32 s) public {
        require(_amount > 0, "Amount must be greater than 0");
        
        IERC20Permit(token).permit(
            msg.sender,
            address(this),
            _amount,
            _deadline,
            v,
            r,
            s
        );

        // IERC20(token).transferFrom(msg.sender, address(this), _amount);
    
        // tokenBalances[token] += _amount;
        // userTokenBalances[msg.sender][token] += _amount;
        // tokenToUsers[token].push(msg.sender);

        // emit DepositMade(msg.sender, token, _amount);
    }

    function swap(address token) public {
        require(tokenBalances[token] >= tokenCaps[token], "Cap not reached yet");

        // Swap logic here ...

        tokenBalances[token] = 0;

        // for (uint256 i = 0; i < tokentoUsers[token].length; i++) {
        //     userTokenBalances[tokentoUsers[token]][token] = 0;
        //     IERC20(token).safeTransferFrom(address(this), userTokenBalances[tokentoUsers[token]], _amount);
        // }

        // emit SwapExecuted(msg.sender, token, address(USDC), _amount, _amount);
    }

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}
}
