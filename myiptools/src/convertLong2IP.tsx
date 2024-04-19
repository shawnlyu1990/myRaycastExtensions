import JSON from "json-bigint";
import { IPv4, IPv6 } from "ip-toolkit";
import { useState } from "react";
import { List, Icon, Color, Action, ActionPanel } from "@raycast/api";
import { systemTypes, DrinkDropdown } from "./components/dropdown";

export default function Command(props: { arguments: { keywork: string } }) {
  const { keywork } = props.arguments;
  const [version, setSystem] = useState<string>("dec");
  const [searchText, setSearchText] = useState<string>(keywork ? keywork : "");
  const isEmpty = searchText.trim() === "";
  let isValid;
  let result = {};
  if (version === "bin") {
    isValid = !isEmpty && /^[0-1]+$/.test(searchText);
    isValid ? (result = {
      IPv4: IPv4.long2ip(parseInt(searchText, 2)),
      IPv6: IPv6.long2ip(BigInt(parseInt(searchText, 2)))
    }) : false;
  }else if (version === "oct") {
    isValid = !isEmpty && /^[0-7]+$/.test(searchText);
    isValid ? (result = {
      IPv4: IPv4.long2ip(parseInt(searchText, 8)),
      IPv6: IPv6.long2ip(BigInt(parseInt(searchText, 8)))
    }) : false;
  }else if (version === "dec") {
    isValid = !isEmpty && /^[0-9]+$/.test(searchText);
    isValid ? (result = {
      IPv4: IPv4.long2ip(parseInt(searchText, 10)),
      IPv6: IPv6.long2ip(BigInt(parseInt(searchText, 10)))
    }) : false;
  }else if (version === "hex") {
    isValid = !isEmpty && /^(0[xX])?[0-9a-fA-F]+$/.test(searchText);
    isValid ? (result = {
      IPv4: IPv4.long2ip(parseInt(searchText, 16)),
      IPv6: IPv6.long2ip(BigInt(parseInt(searchText, 16)))
    }) : false;
  }


  return (
    <List
      throttle={true}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Input Number that needs to be converted！"
      searchBarAccessory={<DrinkDropdown drinkTypes={systemTypes} onDrinkTypeChange={setSystem} />}
    >
      {isEmpty ? (
        <List.EmptyView
          icon={{ source: Icon.Warning, tintColor: Color.Yellow }}
          title="请输入一个二进制、八进制、十进制或十六进制的数值！"
        />
      ) : !isValid ?  (
        <List.EmptyView
          icon={{ source: Icon.XMarkCircle, tintColor: Color.Red }}
          title="请输入一个有效数值！"
        />
      ) : (
        Object.entries(result).map(([key, value], index) => {
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
        })
      )}
    </List>
  );
}