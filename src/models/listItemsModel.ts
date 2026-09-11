export interface ListItemsModel {
    title: string;
    subTitle: string;
    description: string;
    listItems: ListItem[];
}

export interface ListItem {
    title: string;
    description?: string;
    url?: string;
    subListItems?: SubListItem[];
}

interface SubListItem {
    title: string;
    url?: string;
    description?: string;
}