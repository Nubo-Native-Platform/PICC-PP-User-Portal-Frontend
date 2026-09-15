import { ListItem } from "@/models/listItemsModel";
import LaunchIcon from "@mui/icons-material/Launch";

const ListView = ({ item }: { item: ListItem }) => {
    const openDemo = (link: string) => {
        window.open(link, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="pb-[var(--nnp-padding-medium)]">
            <div className={item.subListItems ? `font-[var(--font-bold)]` : `font-[var(--font-light)]`}>
                {item.title}
            </div>
            <div>{item.description}</div>
            {item.subListItems?.map((subItem, i) => (
                <div key={i} className="flex items-center gap-1">
                    •&nbsp;
                    {subItem.url ? (
                        <a
                            className="textLink"
                            href={subItem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {subItem.title.startsWith("Bill Date")
                                ? subItem.title.replace(/T.*/, "")
                                : subItem.title}
                        </a>
                    ) : (
                        <span>
                            {subItem.title.startsWith("Bill Date")
                                ? subItem.title.replace(/T.*/, "")
                                : subItem.title}
                        </span>
                    )}
                    {subItem && (subItem as any).demoLink && (
                        <span
                            className="text-blue-600 cursor-pointer text-sm"
                            onClick={() => openDemo((subItem as any).demoLink)}
                        >
                            <LaunchIcon sx={{
                                color: 'var(--text-color-link)',
                                cursor: 'pointer',
                                fontSize: 16
                            }} />
                        </span>
                    )}

                </div>
            ))}
        </div>
    );
};

export default ListView;
