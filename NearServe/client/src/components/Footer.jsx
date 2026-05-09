import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} NearServe. All rights reserved. Made with ❤️ by Shivam Vishwakarma</p>
    </footer>
  );
}