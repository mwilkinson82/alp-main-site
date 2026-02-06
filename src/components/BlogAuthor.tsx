import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import marshallCasual from "@/assets/marshall-casual.jpg";

const BlogAuthor = () => {
  return (
    <div className="flex items-center gap-4 py-6 border-t border-b border-border my-8">
      <Avatar className="h-14 w-14">
        <AvatarImage src={marshallCasual} alt="Marshall Wilkinson" className="object-cover" />
        <AvatarFallback>MW</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Written by</p>
        <p className="text-lg font-bold">Marshall Wilkinson</p>
        <p className="text-sm text-muted-foreground">
          Business Coach, Strategic Consultant & Founder of ALP
        </p>
      </div>
    </div>
  );
};

export default BlogAuthor;
