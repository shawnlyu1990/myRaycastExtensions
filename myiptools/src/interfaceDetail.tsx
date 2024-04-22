import { ActionPanel, Action, List, Icon } from "@raycast/api";
import os from "os";

export function InterfaceDetailv4( {interfaceName}:{interfaceName:string} ) {
  const interfaces:{[key:string]:any;} = os.networkInterfaces();
  const result = interfaces[interfaceName] !== undefined ? (interfaces[interfaceName][0].family === "IPv4" ? interfaces[interfaceName][0] : interfaces[interfaceName][1]) : {"网卡未启动":"IPv4地址未获得"} ;

  return (
    <List>
      {Object.entries(result).map(([key, value], index) => {
        if (value !== "") {
          return (
            <List.Item
              key={index}
              icon={Icon.Clipboard}
              title={key}
              subtitle={`${value}`}
              actions={
                <ActionPanel>
                  <Action.CopyToClipboard title="复制到剪贴板" content={`${value}`} />
                  <Action.CopyToClipboard
                    title="复制全部内容到剪贴板"
                    content={JSON.stringify(result, null, 2)}
                  />
                </ActionPanel>
              }
            />
          );
        }
      })}
    </List>
  );
}

export function InterfaceDetailv6( {interfaceName}:{interfaceName:string} ) {
  const interfaces:{[key:string]:any;} = os.networkInterfaces();
  const result = interfaces[interfaceName] !== undefined ? (interfaces[interfaceName][0].family === "IPv6" ? interfaces[interfaceName][0] : interfaces[interfaceName][1]) : {"网卡未启动":"IPv6地址未获得"} ;

  return (
    <List>
      {Object.entries(result).map(([key, value], index) => {
        if (value !== "") {
          return (
            <List.Item
              key={index}
              icon={Icon.Clipboard}
              title={key}
              subtitle={`${value}`}
              actions={
                <ActionPanel>
                  <Action.CopyToClipboard title="复制到剪贴板" content={`${value}`} />
                  <Action.CopyToClipboard
                    title="复制全部内容到剪贴板"
                    content={JSON.stringify(result, null, 2)}
                  />
                </ActionPanel>
              }
            />
          );
        }
      })}
    </List>
  );
}