const Footer = () => {
  return (
    <footer className="w-full bg-emerald-primary text-white p-4">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} Penny Pal - Smart Expense Tracker for Students</p>
      </div>
    </footer>
  );
};

export default Footer; 