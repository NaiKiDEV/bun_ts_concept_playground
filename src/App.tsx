import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import "./index.css";
import { DebugPage, StoreExample, OptionsPlayground } from "./pages";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ThemeProvider } from "./components/theme-provider";

const Root = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="h-full flex flex-col">
      <nav className="bg-zinc-950 py-2 px-4 border-b border-b-primary-foreground">
        <NavigationMenu>
          <NavigationMenuList className="gap-4">
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
                active={path === "/store"}
              >
                <Link to="/store">Store Demo</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
                active={path === "/debug"}
              >
                <Link to="/debug">Debug Land</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
                active={path === "/options"}
              >
                <Link to="/options">Options Playground</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
      <main className="grow p-2">
        <Outlet />
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "store",
        element: <StoreExample />,
      },
      {
        path: "debug",
        element: <DebugPage />,
      },
      {
        path: "options",
        element: <OptionsPlayground />,
      },
    ],
  },
]);

const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
