
import { NavLink } from "react-router-dom";
import { Home, MessageCircle, CheckSquare, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const MobileBottomNav = () => {
  const navItems = [
    { to: "/", icon: <Home size={24} />, label: "Home" },
    { to: "/messages", icon: <MessageCircle size={24} />, label: "Messages", badge: 0 },
    { to: "/tasks", icon: <CheckSquare size={24} />, label: "Tasks" },
    { to: "/quick-actions", icon: <MoreHorizontal size={24} />, label: "More" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full text-sm font-medium transition-colors relative ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`
            }
          >
            {item.badge > 0 && (
              <Badge
                variant="destructive"
                className="absolute top-1 right-1/2 translate-x-[20px] px-2 py-0.5 h-auto text-xs"
              >
                {item.badge}
              </Badge>
            )}
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
