import {
  Facebook,
  Instagram,
  LinkedIn,
  Twitter,
  Copyright,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="nnp-bottom-footer">
      <div className="flex flex-col items-center gap-1 mt-1">

        {/* Policy Links as Circular Buttons */}
        <div className="flex gap-2 justify-center text-[var(--text-color-secondary)] font-xxl">
          {[
            { label: "T", title: "Terms of Use", href: "https://www.nubons.net/_files/ugd/57f41b_a82a15cc88334ad9897a4bcea3ca3e7d.pdf" },
            { label: "P", title: "Privacy Policy", href: "https://www.nubons.net/_files/ugd/57f41b_2679ab9f20f54650947d162bfd527daf.pdf" },
            { label: "D", title: "Data Privacy", href: "https://www.nubons.net/_files/ugd/57f41b_d6e73f4124d642efa73d6c6c90c433ff.pdf" },
          ].map(({ label, title, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={title}
              title={title}
              className="w-8 h-8 rounded-full bg-[var(--component-color-blue)] flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              {label}
            </a>
          ))}
        </div>
        {/* Social Media Icons */}
        <div className="flex gap-1 text-[var(--text-color-secondary)] font-xxl">
          <a
            href="https://www.facebook.com/people/Nubo-Native-Solutions/61583046802337/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          ><Facebook /></a>
          <a
            href="https://www.instagram.com/nubons_official/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          ><Instagram /></a>
          <a
            href="https://x.com/nubonsofficial/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          ><Twitter /></a>
          <a
            href="https://www.linkedin.com/company/nubo-native-solutions/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          ><LinkedIn /></a>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
