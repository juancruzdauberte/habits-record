import { EmailWidget } from "../common/widgets/EmailWidget";
import { InstagramWidget } from "../common/widgets/InstagramWidget";
import { LinkedinWidget } from "../common/widgets/LinkedinWidget";

export const Footer = () => {
  return (
    <section className="flex flex-col gap-2 justify-center items-center w-full p-2">
      <section>
        <span className="font-bold">© Juan Cruz Dauberte</span>
      </section>
      <section className="flex gap-3">
        <LinkedinWidget />
        <InstagramWidget />
        <EmailWidget />
      </section>
    </section>
  );
};
