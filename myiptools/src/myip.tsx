import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { address } from "ip";
import { useState } from "react";

import IPLookUp from "./myiplookup";
import { headers } from "./util";

export default function Command() {
  const { pop } = useNavigation();
  const [localIp] = useState(() => address("public", "ipv4").toString());

  const { isLoading, data, error, revalidate } = useFetch<string>("https://api64.ipify.org", {
    headers,
    keepPreviousData: true,
  });

  return (
    <List isLoading={isLoading}>
      <List.Item
        icon={Icon.Desktop}
        title={localIp}
        actions={
          !!localIp && (
            <ActionPanel>
              <Action.CopyToClipboard
                content={localIp}
                onCopy={() => {
                  pop();
                }}
              />
              <Action
                title="Refresh"
                onAction={() => revalidate()}
                icon={Icon.Repeat}
                shortcut={{ key: "r", modifiers: ["cmd"] }}
              />
            </ActionPanel>
          )
        }
        accessories={[
          {
            text: "本地IP",
          },
        ]}
      />
      <List.Item
        subtitle={!data && isLoading ? "Loading..." : error ? "Failed to load" : undefined}
        icon={Icon.Globe}
        title={data || "Loading..."}
        actions={
          !isLoading && !!data ? (
            <ActionPanel>
              <Action.CopyToClipboard
                content={data}
                onCopy={() => {
                  pop();
                }}
              />
              <Action
                title="Refresh"
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
      {!isLoading && !error && !!data ? (
        <>
          <List.Item
            icon={data === "" ? "" : Icon.Eye}
            title=""
            subtitle="更多信息"
            actions={
              <ActionPanel>
                <Action.Push title="查看公网IP更多信息" target={<IPLookUp ip={data} />} icon={Icon.Eye} />
              </ActionPanel>
            }
            accessories={[
              {
                text: "查看公网IP更多信息",
              },
            ]}
          />
        </>
      ) : null}
    </List>
  );
}