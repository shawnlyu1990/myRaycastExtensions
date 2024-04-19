import { Action, ActionPanel, Icon, List, useNavigation, environment } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { address, mask, cidr, subnet } from "ip";
import { useState } from "react";
import IPLookUp from "./myiplookup";

export default function Command() {
  const { pop } = useNavigation();
  const [WiredIP] = useState(() => address(undefined, "ipv4").toString());
  //const [WiFiIP] = useState(() => address("en0", "ipv4").toString());
  const headers: HeadersInit = { "User-Agent": `Raycast/${environment.raycastVersion} (https://raycast.com)`, };
  const { isLoading, data, error, revalidate } = useFetch<string>("https://api64.ipify.org", {
    headers,
    keepPreviousData: true,
  });

  return (
    <List isLoading={isLoading}>
      <List.Item
        icon={Icon.Desktop}
        title={WiredIP}
        actions={
          !!WiredIP && (
            <ActionPanel>
              <Action.CopyToClipboard
                content={WiredIP}
                onCopy={() => {
                  pop();
                }}
              />
              <Action
                title="刷新"
                onAction={() => revalidate()}
                icon={Icon.Repeat}
                shortcut={{ key: "r", modifiers: ["cmd"] }}
              />
            </ActionPanel>
          )
        }
        accessories={[
          {
            text: "有线网卡IP",
          },
        ]}
      />
      <List.Item
        subtitle={!data && isLoading ? "加载中..." : error ? "加载失败" : undefined}
        icon={Icon.Globe}
        title={data || "加载中..."}
        actions={
          !isLoading && !!data ? (
            <ActionPanel>
              <Action.Push 
                title="查看公网IP更多信息" 
                target={<IPLookUp ip={data}/>}
              />
              <Action
                title="刷新"
                onAction={() => revalidate()}
                icon={Icon.Repeat}
                shortcut={{ key: "r", modifiers: ["cmd"] }}
              />
            </ActionPanel>
          ) : null
        }
        accessories={[
          {
            text: "公网IP",
          },
        ]}
      />
    </List>
  );
}