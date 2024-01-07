import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import KanbanBoards from "./components/KanbanBoards/KanbanBoards";
import { ConfigProvider } from "antd";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "'Marcellus', serif",
          },
        }}
      >
        <KanbanBoards />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
