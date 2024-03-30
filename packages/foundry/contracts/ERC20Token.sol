import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract ERC20Token is ERC20, ERC20Permit {
  constructor() ERC20("ERC20Token", "ERCT") ERC20Permit("ERC20Token") {}
  function mint(address _to, uint256 _amount) external {
    _mint(_to, _amount);
  }
}