export default function Dashboard() {
    return (
      <div className="dashboard">
        <nav className="menu">
          <a>Dashboard</a>
          <a>My Income</a>
          <a>My Expenses</a>
          <a>My Activity</a>
        </nav>
  
        <div className="balance-dashboard">
          <h1>Current Balance: 100.00</h1>
          <h2>Last transaction date: mm/dd/yy</h2>
        </div>
      </div>
    );
  }