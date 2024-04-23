import { Action, ActionPanel, Icon, List, useNavigation, environment } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import IPLookUp from "./myiplookup";
import os from "os";

export default function Command() {
  const interfaces = os.networkInterfaces();
  let WiredIPv4 = [];
  let WiredIPv6 = [];
  let WiFiIPv4 = [];
  let WiFiIPv6 = [];
  if (interfaces.en6 !== undefined) {
    for (let i=0;i<interfaces.en6.length;i++){
      if (interfaces.en6[i].family === "IPv4") {
        WiredIPv4.push(interfaces.en6[i].cidr);
      }else if (interfaces.en6[i].family === "IPv6") {
        WiredIPv6.push(interfaces.en6[i].cidr);
      }
    }
  } else {
    WiredIPv4.push("网卡未启用");
    WiredIPv6.push("网卡未启用");
  }
  if (interfaces.en0 !== undefined) {
    for (let i=0;i<interfaces.en0.length;i++){
      if (interfaces.en0[i].family === "IPv4") {
        WiFiIPv4.push(interfaces.en0[i].cidr);
      }else if (interfaces.en0[i].family === "IPv6") {
        WiFiIPv6.push(interfaces.en0[i].cidr);
      }
    }
  } else {
    WiFiIPv4.push("网卡未启用");
    WiFiIPv6.push("网卡未启用");
  }
  const headers: HeadersInit = { "User-Agent": `Raycast/${environment.raycastVersion} (https://raycast.com)`, };
  const { isLoading, data, error, revalidate } = useFetch<string>("https://api64.ipify.org", {
    headers,
    keepPreviousData: true,
  });

  return (
    <List>
      {WiredIPv4.map((value) => (
        <List.Item
          icon={Icon.Desktop}
          title={`${value}`}
          subtitle={`${interfaces.en6 !== undefined ? interfaces.en6[0].mac : "网卡未启用"}`}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard title="复制到剪贴板" content={`${value}`} />
              <Action.CopyToClipboard
                title="复制全部内容到剪贴板"
                content={JSON.stringify(WiredIPv4, null, 2)}
              />
            </ActionPanel>
          }
          accessories={[
            {
              text: "有线网卡（en6）IPv4地址",
            },
          ]}
        />
      ))}
      {WiredIPv6.map((value) => (
        <List.Item
          icon={Icon.Desktop}
          title={`${value}`}
          subtitle={`${interfaces.en6 !== undefined ? interfaces.en6[0].mac : "网卡未启用"}`}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard title="复制到剪贴板" content={`${value}`} />
              <Action.CopyToClipboard
                title="复制全部内容到剪贴板"
                content={JSON.stringify(WiredIPv6, null, 2)}
              />
            </ActionPanel>
          }
          accessories={[
            {
              text: "有线网卡（en6）IPv6地址",
            },
          ]}
        />
      ))}
      {WiFiIPv4.map((value) => (
        <List.Item
          icon={Icon.Wifi}
          title={`${value}`}
          subtitle={`${interfaces.en0 !== undefined ? interfaces.en0[0].mac : "网卡未启用"}`}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard title="复制到剪贴板" content={`${value}`} />
              <Action.CopyToClipboard
                title="复制全部内容到剪贴板"
                content={JSON.stringify(WiFiIPv4, null, 2)}
              />
            </ActionPanel>
          }
          accessories={[
            {
              text: "无线网卡（en0）IPv4地址",
            },
          ]}
        />
      ))}
      {WiFiIPv6.map((value) => (
        <List.Item
          icon={Icon.Wifi}
          title={`${value}`}
          subtitle={`${interfaces.en0 !== undefined ? interfaces.en0[0].mac : "网卡未启用"}`}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard title="复制到剪贴板" content={`${value}`} />
              <Action.CopyToClipboard
                title="复制全部内容到剪贴板"
                content={JSON.stringify(WiFiIPv6, null, 2)}
              />
            </ActionPanel>
          }
          accessories={[
            {
              text: "无线网卡（en0）IPv6地址",
            },
          ]}
        />
      ))}
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