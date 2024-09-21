import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { RocketIcon, StarIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Move EmailForm outside of the main component
const EmailForm = ({
  email,
  setEmail,
  isSubscribed,
  handleSubmit,
}: {
  email: string;
  setEmail: (email: string) => void;
  isSubscribed: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}) => (
  <div className="bg-blue-600 py-6">
    <div className="container mx-auto px-4 text-center">
      {isSubscribed ? (
        <h2 className="text-4xl font-bold mb-4">Thanks for subscribing!</h2>
      ) : (
        <>
          <h2 className="text-4xl font-bold mb-4">
            Ready for Your Space Adventure?
          </h2>
          <p className="text-xl mb-8">
            Sign up for our newsletter and get 10% off your first spacesuit!
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full md:w-64 bg-white text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
            >
              Subscribe
            </Button>
          </form>
        </>
      )}
    </div>
  </div>
);

// At the top of your file, add or update the User interface
interface User {
  key: string;
  name: string;
  email: string;
  appName: string;
}

export default function Component() {
  const client = useLDClient();
  const { toast } = useToast();

  // LAUNCHDARKLY SETUP: This is us bringing client side flags in from the LD SDK
  const { storeColors, emailFormLocation } = useFlags();

  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);

    // LAUNCHDARKLY SETUP: This is the metric event being submitted for an email conversion
    await client?.track("emailSubmitted", { email });

    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setIsSubscribed(true);
    await client?.flush();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Fake login logic
    if (username && password) {
      const newUser = {
        key: username,
        name: username,
        email: `${username}@launchmail.io`,
        appName: "LD Demo"
      };
      setUser(newUser);

      // LAUNCHDARKLY SETUP: This is the identify event being submitted for the user

      await client?.identify(newUser);
      toast({
        title: "Logged in!",
        description: `Welcome, ${username}!`,
      });
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <RocketIcon className="h-8 w-8 text-blue-500" />
          <span className="text-2xl font-bold">Darkly SpaceSuits</span>
        </div>
        {storeColors ? (
          <nav className="hidden md:flex space-x-4">
            <a href="#" className="hover:text-blue-400 transition">
              Home
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              Shop
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              About
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              Contact
            </a>
          </nav>
        ) : null}
        <div className="flex items-center space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-transparent border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              >
                <UserIcon className="mr-2 h-4 w-4" />
                {user ? user.name : "Sign In"}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Sign In</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 text-white"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 text-white"
                />
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            className="bg-transparent border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          >
            <ShoppingCartIcon className="mr-2 h-4 w-4" /> Cart (0)
          </Button>
        </div>
      </header>

      {emailFormLocation && (
        <EmailForm
          email={email}
          setEmail={setEmail}
          isSubscribed={isSubscribed}
          handleSubmit={handleSubmit}
        />
      )}

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-pulse">
          Explore the Cosmos in Style
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Discover our cutting-edge spacesuits designed for the modern space
          traveler. Safety meets fashion in the final frontier.
        </p>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg">
          Shop Now
        </Button>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Spacesuits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Lunar Explorer", image: "/LunarExplorer.png" },
            { name: "Mars Pioneer", image: "/MarsExplorer.png" },
            { name: "Zero-G Fashionista", image: "/FasionistaExplorer.png" },
          ].map((suit, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition duration-300"
            >
              <img
                src={suit.image}
                alt={suit.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{suit.name}</h3>
                <p className="text-gray-400 mb-4">
                  Experience the future of space travel with our
                  state-of-the-art {suit.name.toLowerCase()} suit.
                </p>
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      {!emailFormLocation && (
        <EmailForm
          email={email}
          setEmail={setEmail}
          isSubscribed={isSubscribed}
          handleSubmit={handleSubmit}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © This is a LaunchDarkly Demo Application. We don't actually sell spacesuits.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <StarIcon className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <RocketIcon className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <ShoppingCartIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
