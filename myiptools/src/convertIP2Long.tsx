import JSON from "json-bigint";
import { IPv4, IPv6 } from "ip-toolkit";
import { useState } from "react";
import { List, Icon, Color, Action, ActionPanel } from "@raycast/api";
import { drinkTypes, DrinkDropdown } from "./components/dropdown";

export default function Command(props: { arguments: { keywork: string } }) {
  const { keywork } = props.arguments;
  const [version, setVersion] = useState<string>("IPv4");
  const [searchText, setSearchText] = useState<string>(keywork ? keywork : "");

  const isEmpty = searchText.trim() === "";
  const isValid = isEmpty ? false : version === "IPv4" ? IPv4.isValidIP(searchText) : IPv6.isValidIP(searchText);
  const convertResult = isValid ? (version === "IPv4" ? IPv4.ip2long(searchText) : IPv6.ip2long(searchText)) : 0;

  const _convertResult = {
    decimal: convertResult,
    hex: `0x${convertResult.toString(16)}`,
    binary: convertResult.toString(2),
  };

  return (
    <List
      throttle={true}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="请输入IPv4或IPv6地址！"
      searchBarAccessory={<DrinkDropdown drinkTypes={drinkTypes} onDrinkTypeChange={setVersion} />}
    >
      {isEmpty ? (
        <List.EmptyView
          icon={{ source: Icon.Warning, tintColor: Color.Yellow }}
          title="请输入IPv4或IPv6地址！"
        />
      ) : !isValid ? (
        <List.EmptyView
          icon={{ source: Icon.XMarkCircle, tintColor: Color.Red }}
          title="当前输入的IP地址格式错误，请输入正确的IPv4或IPv6地址！"
        />
      ) : (
        Object.entries(_convertResult).map(([key, value], index) => {
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
