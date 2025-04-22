import { MdOutlineEmail } from "react-icons/md";

export const EmailWidget = () => {
  return (
    <div>
      <a
        href="mailto:tierradenudos@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MdOutlineEmail size={23} />
      </a>
    </div>
  );
};
