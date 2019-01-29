/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { camelCase } from 'lodash';
// @ts-ignore not typed yet
import { XPackInfoProvider } from 'plugins/xpack_main/services/xpack_info';
import 'ui/autoload/all';
import chrome from 'ui/chrome';
// @ts-ignore not typed yet
import { management } from 'ui/management';
import routes from 'ui/routes';
import { INDEX_NAMES } from '../../../common/constants/index_names';
import { getSupportedConfig } from '../../config_schemas_translations_map';
import { RestBeatsAdapter } from '../adapters/beats/rest_beats_adapter';
import { RestElasticsearchAdapter } from '../adapters/elasticsearch/rest';
import { KibanaFrameworkAdapter } from '../adapters/framework/kibana_framework_adapter';
import { AxiosRestAPIAdapter } from '../adapters/rest_api/axios_rest_api_adapter';
import { RestTagsAdapter } from '../adapters/tags/rest_tags_adapter';
import { RestTokensAdapter } from '../adapters/tokens/rest_tokens_adapter';
import { BeatsLib } from '../beats';
import { ElasticsearchLib } from '../elasticsearch';
import { TagsLib } from '../tags';
import { FrontendLibs } from '../types';
import { PLUGIN } from './../../../common/constants/plugin';
import { FrameworkLib } from './../framework';

// A super early spot in kibana loading that we can use to hook before most other things
const onKibanaReady = chrome.dangerouslyGetActiveInjector;

export function compose(): FrontendLibs {
  const api = new AxiosRestAPIAdapter(chrome.getXsrfToken(), chrome.getBasePath());
  const esAdapter = new RestElasticsearchAdapter(api, INDEX_NAMES.BEATS);

  const tags = new TagsLib(new RestTagsAdapter(api), getSupportedConfig());
  const tokens = new RestTokensAdapter(api);
  const beats = new BeatsLib(new RestBeatsAdapter(api), {
    tags,
  });

  const framework = new FrameworkLib(
    new KibanaFrameworkAdapter(
      camelCase(PLUGIN.ID),
      management,
      routes,
      chrome.getBasePath,
      onKibanaReady,
      XPackInfoProvider,
      chrome.getUiSettingsClient()
    )
  );

  const libs: FrontendLibs = {
    framework,
    elasticsearch: new ElasticsearchLib(esAdapter),
    tags,
    tokens,
    beats,
  };
  return libs;
}
