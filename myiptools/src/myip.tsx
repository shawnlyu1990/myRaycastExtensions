import { Action, ActionPanel, Icon, List, useNavigation, environment } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import IPLookUp from "./myiplookup";
import { InterfaceDetailv4, InterfaceDetailv6 } from "./interfaceDetail";
import os from "os";

export default function Command() {
  const { pop } = useNavigation();
  const interfaces = os.networkInterfaces();
  let WiredIPv4;
  let WiredIPv6;
  let WiFiIPv4;
  let WiFiIPv6;
  if (interfaces.en6 !== undefined) {
    WiredIPv4 = interfaces.en6[0].family === "IPv4" ? interfaces.en6[0].address : interfaces.en6[1].address;
    WiredIPv6 = interfaces.en6[0].family === "IPv6" ? interfaces.en6[0].address : interfaces.en6[1].address;
  } else {
    WiredIPv4 = "网卡未启用";
    WiredIPv6 = "网卡未启用";
  }
  if (interfaces.en0 !== undefined) {
    WiFiIPv4 = interfaces.en0[0].family === "IPv4" ? interfaces.en0[0].address : interfaces.en0[1].address;
    WiFiIPv6 = interfaces.en0[0].family === "IPv6" ? interfaces.en0[0].address : interfaces.en0[1].address;
  } else {
    WiFiIPv4 = "网卡未启用";
    WiFiIPv6 = "网卡未启用";
  }
  const headers: HeadersInit = { "User-Agent": `Raycast/${environment.raycastVersion} (https://raycast.com)`, };
  const { isLoading, data, error, revalidate } = useFetch<string>("https://api64.ipify.org", {
    headers,
    keepPreviousData: true,
  });

  return (
    <List isLoading={isLoading}>
      <List.Item
        icon={Icon.Desktop}
        title={WiredIPv4}
        actions={
          !!WiredIPv4 && (
            <ActionPanel>
              <Action.Push title="查看有线网卡更多信息" target={<InterfaceDetailv4 interfaceName="en6"/>} />
              <Action title="刷新" onAction={() => revalidate()} icon={Icon.Repeat} shortcut={{ key: "r", modifiers: ["cmd"] }} />
            </ActionPanel>
          )
        }
        accessories={[
          {
            text: "有线网卡IPv4地址",
          },
        ]}
      />
      <List.Item
        icon={Icon.Desktop}
        title={WiredIPv6}
        actions={
          !!WiredIPv6 && (
            <ActionPanel>
              <Action.Push title="查看有线网卡更多信息" target={<InterfaceDetailv6 interfaceName="en6"/>} />
              <Action title="刷新" onAction={() => revalidate()} icon={Icon.Repeat} shortcut={{ key: "r", modifiers: ["cmd"] }} />
            </ActionPanel>
          )
        }
        accessories={[
          {
            text: "有线网卡IPv6地址",
          },
        ]}
      />
      <List.Item
        icon={Icon.Wifi}
        title={WiFiIPv4}
        actions={
          !!WiFiIPv4 && (
            <ActionPanel>
              <Action.Push title="查看无线网卡更多信息" target={<InterfaceDetailv4 interfaceName="en0"/>} />
              <Action title="刷新" onAction={() => revalidate()} icon={Icon.Repeat} shortcut={{ key: "r", modifiers: ["cmd"] }} />
            </ActionPanel>
          )
        }
        accessories={[
          {
            text: "无线网卡IPv4地址",
          },
        ]}
      />
      <List.Item
        icon={Icon.Wifi}
        title={WiFiIPv6}
        actions={
          !!WiFiIPv6 && (
            <ActionPanel>
              <Action.Push title="查看无线网卡更多信息" target={<InterfaceDetailv6 interfaceName="en0"/>} />
              <Action title="刷新" onAction={() => revalidate()} icon={Icon.Repeat} shortcut={{ key: "r", modifiers: ["cmd"] }} />
            </ActionPanel>
          )
        }
        accessories={[
          {
            text: "无线网卡IPv6地址",
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
              <Action.Push title="查看公网IP更多信息" target={<IPLookUp ip={data}/>} />
              <Action title="刷新" onAction={() => revalidate()} icon={Icon.Repeat} shortcut={{ key: "r", modifiers: ["cmd"] }} />
            </ActionPanel>
          ) : null
        }
        accessories={[
          {
            text: "公网IP地址",
          },
        ]}
      />
    </List>
  );
}