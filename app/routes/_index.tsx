import { renderToString } from 'react-dom/server';
import algoliasearch from 'algoliasearch/lite';
import type { InstantSearchServerState } from 'react-instantsearch';
import {
  DynamicWidgets,
  Hits,
  InstantSearch,
  InstantSearchSSRProvider,
  Pagination,
  RefinementList,
  SearchBox,
  useInstantSearch,
  getServerState,
} from 'react-instantsearch';
import { history } from 'instantsearch.js/cjs/lib/routers/index.js';
import instantSearchStyles from 'instantsearch.css/themes/satellite-min.css';
import { createFetchRequester } from '@algolia/requester-fetch';

import type { LinksFunction, MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

import { MantineProvider } from "@mantine/core";

import { Hit } from '~/components/Hit';
import { Panel } from '~/components/Panel';
import { ScrollTo } from '~/components/ScrollTo';
import { NoResultsBoundary } from '~/components/NoResultsBoundary';
import { SearchErrorToast } from '~/components/SearchErrorToast';
import tailwindStyles from '../styles/tailwind.css';

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const searchClient = algoliasearch(
  'DPK8SIFE76',
  'ce2f66a6be69d4d6e839d33df7c43f72',
  {
    requester: createFetchRequester(),
  }
);

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: instantSearchStyles },
  { rel: 'stylesheet', href: tailwindStyles },
];

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl = request.url;
  const serverState = await getServerState(<Search serverUrl={serverUrl} />, {
    renderToString,
  });

  return json({
    serverState,
    serverUrl,
  });
};

type SearchProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
};

function Search({ serverState, serverUrl }: SearchProps) {
  return (
    <MantineProvider>
      <InstantSearchSSRProvider {...serverState}>
        <InstantSearch
          searchClient={searchClient}
          indexName="touhou_karaoke"
          routing={{
            router: history({
              getLocation() {
                if (typeof window === 'undefined') {
                  return new URL(serverUrl!) as unknown as Location;
                }

                return window.location;
              },
            }),
          }}
          insights={true}
        >
          <SearchErrorToast />

          <ScrollTo className="max-w-6xl p-4 flex gap-1 m-auto">
            <div>
              <DynamicWidgets fallbackComponent={FallbackComponent} />
            </div>

            <div className="flex flex-col w-full gap-8">
              <SearchBox />
              <NoResultsBoundary fallback={<NoResults />}>
                <Hits
                  hitComponent={Hit}
                  classNames={{
                    list: 'grid grid-cols-1 gap-1 lg:grid-cols-3',
                    item: 'p-2 w-full',
                  }}
                />
                <Pagination className="flex self-center" />
              </NoResultsBoundary>
            </div>
          </ScrollTo>
        </InstantSearch>
      </InstantSearchSSRProvider>
    </MantineProvider>
  );
}

function FallbackComponent({ attribute }: { attribute: string }) {
  return (
    <Panel header={attribute}>
      <RefinementList attribute={attribute} />
    </Panel>
  );
}

function NoResults() {
  const { indexUiState } = useInstantSearch();

  return (
    <div>
      <p>
        <q>{indexUiState.query}</q> は見つかりませんでした。
      </p>
    </div>
  );
}

export default function HomePage() {
  const { serverState, serverUrl } = useLoaderData();

  return (
    <>
      <Search serverState={serverState} serverUrl={serverUrl} />
    </>
  );
}
