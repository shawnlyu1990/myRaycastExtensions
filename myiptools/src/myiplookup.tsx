import { ActionPanel, Action, useNavigation, List, Icon, environment } from "@raycast/api";
import { useFetch } from "@raycast/utils";

type IPData = {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
};

const showItems: Partial<Record<keyof IPData, string>> = {
  ip: "IP地址",
  network: "网络",
  version: "IP协议版本",
  city: "城市",
  region: "地区",
  region_code: "地区代码",
  country: "国家（简写）",
  country_name: "国家",
  country_code: "国家代码",
  postal: "邮政编码",
  in_eu: "欧盟",
  latitude: "纬度",
  longitude: "经度",
  timezone: "时区",
  utc_offset: "与UTC的差值",
  country_calling_code: "国际区号",
  currency: "货币",
  languages: "语言",
  country_area: "国土面积",
  country_population: "国家人口",
  asn: "ASN",
  org: "ISP提供商",
};

export default function IPLookUp({ ip }: { ip: string }) {
  const { pop } = useNavigation();
  const headers: HeadersInit = { "User-Agent": `Raycast/${environment.raycastVersion} (https://raycast.com)`, };
  const { isLoading, data, revalidate } = useFetch<IPData>(`https://ipapi.co/${ip}/json/`, {
    headers,
    keepPreviousData: true,
  });

  return (
    <List
      isLoading={isLoading}
      navigationTitle="IP Lookup"
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            url={"https://ipapi.co"}
            onOpen={() => {
              pop();
            }}
          />
        </ActionPanel>
      }
    >
      {Object.keys(data || {}).map((key) => {
        const keyName = key as keyof IPData;
        return (
          Object.prototype.hasOwnProperty.call(showItems, key) && (
            <List.Item
              key={key}
              title={showItems[keyName]!}
              accessories={[{ text: data && data[keyName] ? data[keyName].toString() : "" }]}
              actions={
                <ActionPanel>
                  <Action.CopyToClipboard
                    title={`复制 ${showItems[keyName]} 到剪贴板`}
                    content={data && data[keyName] ? data[keyName].toString() : ""}
                  />
                  <Action.OpenInBrowser
                    url={`https://ipapi.co/?q=${ip}`}
                    onOpen={() => {
                      pop();
                    }}
                  />
                  <Action
                    title="刷新"
                    onAction={() => revalidate()}
                    icon={Icon.Repeat}
                    shortcut={{ key: "r", modifiers: ["cmd"] }}
                  />
                </ActionPanel>
              }
            />
          )
        );
      })}
    </List>
  );
}