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
    mapping(address => uint256) public tokenCaps;
    mapping(address => uint256) public tokenBalances;
    mapping(address => mapping(address => uint256)) public userTokenBalances;

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

    // Constructor: Called once on contract deployment
    // Check packages/foundry/deploy/Deploy.s.sol
    constructor(address _owner) {
        owner = _owner;
        tokenCaps[address(USDC)] = 1000;
        tokenCaps[address(USDT)] = 1000;
        tokenCaps[address(DAI)] = 1000;
    }

    // Modifier: used to define a set of rules that must be met before or after a function is executed
    // Check the withdraw() function
    modifier onlyOwner() {
        // msg.sender: predefined variable that represents address of the account that called the current function
        require(msg.sender == owner, "Not the Owner");
        _;
    }

    function updateCaps(address _token, uint256 _amount) onlyOwner public {
        tokenCaps[_token] = 1000;
    }

    function deposit(address token, uint256 _amount, Permit calldata _signature) public {
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
    
        tokenBalances[token] += _amount;
        userTokenBalances[_signature.owner][token] += _amount;

        emit DepositMade(_signature.owner, token, _amount);
    }

    function swap(address token) public {
        require(tokenBalances[token] >= tokenCaps[token], "Cap not reached yet");

        // Swap logic here ...

        tokenBalances[token] = 0;

        for (uint256 i = 0; i < tokenBalances[token]; i++) {
            userTokenBalances[msg.sender][token] = 0;
            IERC20(token).safeTransferFrom(address(this), _signature.owner, _amount);
        }

        emit SwapExecuted(msg.sender, token, address(USDC), _amount, _amount);
    }

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}
}
