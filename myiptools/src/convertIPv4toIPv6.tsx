import { useState } from "react";
import { IPv4 } from "ip-toolkit";
import { List, Icon, Color, Action, ActionPanel } from "@raycast/api";

export default function Command(props: { arguments: { keywork: string } }) {
  const { keywork } = props.arguments;
  const [searchText, setSearchText] = useState<string>(keywork ? keywork : "");

  const isEmpty = searchText.trim() === "";
  const isValid = isEmpty ? false : IPv4.isValidIP(searchText);
  const convertResult = isValid ? IPv4.toIPv6Format(searchText) : {};

  return (
    <List
      throttle={true}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="请输入IPv4地址！"
    >
      {isEmpty ? (
        <List.EmptyView
          icon={{ source: Icon.Warning, tintColor: Color.Yellow }}
          title="请输入IPv4地址！"
        />
      ) : !isValid ? (
        <List.EmptyView
          icon={{ source: Icon.XMarkCircle, tintColor: Color.Red }}
          title="当前输入的IPv4地址格式错误，请重新输入！"
        />
      ) : (
        Object.entries(convertResult).map(([key, value], index) => {
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
                      title="复制所有内容到剪贴板"
                      content={JSON.stringify(convertResult, null, 2)}
                    />
                  </ActionPanel>
                }
              />
            );
          }
        })
      )}
    </List>
  );
}