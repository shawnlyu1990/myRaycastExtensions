import axios from "axios";
import { useState } from "react";
import { IP } from "ip-toolkit";
import { usePromise } from "@raycast/utils";
import { langTypes, DrinkDropdown } from "./components/dropdown";
import { List, Icon, Color, Action, ActionPanel } from "@raycast/api";

export default function Command(props: { arguments: { keywork: string } }) {
  const { keywork } = props.arguments;
  const [searchText, setSearchText] = useState<string>(keywork ? keywork : "");

  const isEmpty = searchText.trim() === "";
  const isValid = isEmpty ? false : IP.isValidIP(searchText);

  const [lang, setLang] = useState<string>("en");
  const { isLoading, data: convertResult = {} } = usePromise(
    async (ip: string, lang: string = "en") => {
      try {
        if (!isValid && !isEmpty) return { status: "fail" };
        return (await axios(`http://ip-api.com/json/${ip}?lang=${lang}&&fields=61151`)).data;
      } catch (error) {
        return { status: "fail" };
      }
    },
    [searchText, lang],
  );

  return (
    <List
      throttle={true}
      isLoading={isLoading}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="输入需要查询的IP地址！"
      searchBarAccessory={<DrinkDropdown drinkTypes={langTypes} onDrinkTypeChange={setLang} />}
    >
      {!isValid && !isEmpty ? (
        <List.EmptyView
          icon={{ source: Icon.XMarkCircle, tintColor: Color.Red }}
          title="当前输入的IP地址格式错误，请重新输入！"
        />
      ) : (
        Object.entries(convertResult)
          .sort()
          .map(([key, value], index) => {
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