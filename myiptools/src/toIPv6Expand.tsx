import { IPv6 } from "ip-toolkit";
import { useState } from "react";
import { List, Icon, Action, Color, ActionPanel } from "@raycast/api";
import { formatTypes, DrinkDropdown } from "./components/dropdown";

export default function Command(props: { arguments: { keywork: string } }) {
  const { keywork } = props.arguments;
  const [format, setFormat] = useState<string>("expanded");
  const [searchText, setSearchText] = useState<string>(keywork ? keywork : "");

  const isEmpty = searchText.trim() === "";
  const isValid = isEmpty ? false : IPv6.isValidIP(searchText);
  const convertResult = isValid
    ? (format === "expanded" ? IPv6.expandedForm(searchText) : IPv6.compressedForm(searchText)).toString()
    : "";

  return (
    <List
      throttle={true}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="请输入IPv6地址！"
      searchBarAccessory={<DrinkDropdown drinkTypes={formatTypes} onDrinkTypeChange={setFormat} />}
    >
      {isEmpty ? (
        <List.EmptyView
          icon={{ source: Icon.Warning, tintColor: Color.Yellow }}
          title="请输入IPv6地址！"
        />
      ) : !isValid ? (
        <List.EmptyView
          icon={{ source: Icon.XMarkCircle, tintColor: Color.Red }}
          title="当前输入的IPv6地址格式不正确请重新输入！"
        />
      ) : (
        <List.Item
          icon={Icon.Clipboard}
          title={convertResult}
          //subtitle={searchText}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard title="复制到剪贴板" content={convertResult} />
            </ActionPanel>
          }
        />
      )}
    </List>
  );
}