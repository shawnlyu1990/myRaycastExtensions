import JSON from "json-bigint";
import { useState } from "react";
import { IPv4, IPv6 } from "ip-toolkit";
import { List, Icon, Color, Action, ActionPanel } from "@raycast/api";

export default function Command(props: { arguments: { keywork: string } }) {
  const { keywork } = props.arguments;
  const [searchText, setSearchText] = useState<string>(keywork ? keywork : "");
  const isEmpty = searchText.trim() === "";

  let isValid;
  let convertResult = {};
  if (/^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(255|254|252|248|240|224|192|128|0)$/.test(searchText)) {
    isValid = isEmpty ? false : IPv4.isValidMask(searchText);
    isValid ? (convertResult = {
      CIDR掩码: IPv4.toMaskLength(searchText),
      子网掩码: searchText
    }) : false;
  } else if (/^(([0-2]?[0-9])|30|31|32)$/.test(searchText)) {
    isValid = isEmpty ? false : IPv4.isValidMask(parseInt(searchText));
    isValid ? (convertResult = {
      CIDR掩码: searchText,
      子网掩码: IPv4.toSubnetMask(parseInt(searchText))
    }) : false;
  }
  
  return (
    <List
      throttle={true}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="请输入CIDR掩码或子网掩码！"
    >
      {isEmpty ? (
        <List.EmptyView
          icon={{ source: Icon.Warning, tintColor: Color.Yellow }}
          title="请输入CIDR掩码或子网掩码！"
        />
      ) : !isValid ? (
        <List.EmptyView icon={{ source: Icon.XMarkCircle, tintColor: Color.Red }} title="当前输入的掩码格式错误，请重新输入！" />
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
                      title="复制全部内容到剪贴板"
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