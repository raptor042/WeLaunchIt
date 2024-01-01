import { ReactNode } from "react";

import { Web3Provider } from "@dex/contexts/Web3";
import { FormProvider } from "@dex/contexts/Form";

import { ToastProvider } from "react-toast-notifications";

type ProvidersPropsType = {
  children?: ReactNode;
};

export default function Providers({ children }: ProvidersPropsType) {
  return (
    <ToastProvider autoDismiss={true}>
      <Web3Provider>
        <FormProvider>{children}</FormProvider>
      </Web3Provider>
    </ToastProvider>
  );
}
