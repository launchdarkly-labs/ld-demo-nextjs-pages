import { ReactNode, useEffect, useState } from 'react';
import { asyncWithLDProvider, LDContext } from "launchdarkly-react-client-sdk";
import { setCookie } from "cookies-next";
import { faker } from "@faker-js/faker";

interface LDProviderProps {
  children: ReactNode;
}

export function LDProvider({ children }: LDProviderProps) {
  const [LDProviderComponent, setLDProviderComponent] = useState<React.ComponentType<{ children: ReactNode }> | null>(null);

  useEffect(() => {
    const initLDProvider = async () => {
      const context: LDContext = {
        key: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        appName: faker.company.name(),
      };

      setCookie("ld-context", context);

      console.log(context);

      const LDProvider = await asyncWithLDProvider({
        clientSideID: process.env.NEXT_PUBLIC_LD_CLIENT_KEY || "",
        reactOptions: {
          useCamelCaseFlagKeys: false,
        },
        context: context,
      });

      setLDProviderComponent(() => LDProvider);
    };

    initLDProvider();
  }, []);

  if (!LDProviderComponent) {
    return null;
  }

  return <LDProviderComponent>{children}</LDProviderComponent>;
}
