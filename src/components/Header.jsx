import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full bg-emerald-primary p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Penny Pal</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="#features" className="hover:underline">Features</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 