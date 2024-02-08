export type Guild = {
  features: string[];
  icon: string;
  id: string;
  name: string;
  owner: boolean;
  permissions: number;
  permissions_new: string;
};

export type Chat = {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  publishStatus: "private" | "public" | "guild" | "deleted";
};
