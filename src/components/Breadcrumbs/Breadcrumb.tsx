import Link from "next/link";

interface BreadcrumbLink {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  pageName: string;
  links?: BreadcrumbLink[];
}

const Breadcrumb = ({ pageName, links = [] }: BreadcrumbProps) => {
  // If no links are provided, use the default breadcrumb structure
  const breadcrumbLinks =
    links.length > 0
      ? links
      : [{ label: "Dashboard", href: "/" }, { label: pageName }];

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          {breadcrumbLinks.map((link, index) => (
            <li key={index} className="flex items-center gap-2">
              {link.href ? (
                <Link className="font-medium" href={link.href}>
                  {link.label}
                </Link>
              ) : (
                <span className="font-medium text-primary">{link.label}</span>
              )}
              {index < breadcrumbLinks.length - 1 && <span>/</span>}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
