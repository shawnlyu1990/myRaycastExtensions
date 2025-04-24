import JSON from "json-bigint";
import { useState } from "react";
import { IPv4, IPv6 } from "ip-toolkit";
import { List, Icon, Color, Action, ActionPanel } from "@raycast/api";
import { drinkTypes, DrinkDropdown } from "./components/dropdown";

export default function Command(props: { arguments: { keywork: string } }) {
  const { keywork } = props.arguments;
  const [version, setVersion] = useState<string>("IPv4");
  const [searchText, setSearchText] = useState<string>(keywork ? keywork : "");
  const isEmpty = searchText.trim() === "";
  const IP = searchText.split("/", 2)[0];
  const MASK = searchText.split("/", 2)[1];
  let CIDRMASK:string = "";
  if (version == "IPv4") {
    if (/^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(255|254|252|248|240|224|192|128|0)$/.test(MASK)) {
      CIDRMASK = IPv4.toMaskLength(MASK).toString();
    } else if (/^(([0-2]?[0-9])|30|31|32)$/.test(MASK)) {
      CIDRMASK = MASK.toString();
    }
  } else if (version == "IPv6") {
    if (/^0?\d|[1-9]\d|1([0-1]\d|2[0-8])$/.test(MASK)) {
      CIDRMASK = MASK.toString();
    }
  }
  const isValid = isEmpty ? false : version === "IPv4" ? IPv4.isCIDR(IP + "/" + CIDRMASK) : IPv6.isCIDR(IP + "/" + CIDRMASK);
  const convertResult = isValid ? (version === "IPv4" ? IPv4.parseCIDR(IP + "/" + CIDRMASK) : IPv6.parseCIDR(IP + "/" + CIDRMASK)) : {};

  return (
    <List
      throttle={true}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="请按「IP/掩码」格式输入待分析的IP地址！"
      searchBarAccessory={<DrinkDropdown drinkTypes={drinkTypes} onDrinkTypeChange={setVersion} />}
    >
      {isEmpty ? (
        <List.EmptyView
          icon={{ source: Icon.Warning, tintColor: Color.Yellow }}
          title="请按「IP/掩码」格式输入待分析的IP地址！"
        />
      ) : !isValid ? (
        <List.EmptyView icon={{ source: Icon.XMarkCircle, tintColor: Color.Red }} title="当前输入的IP地址格式错误，请重新输入！" />
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