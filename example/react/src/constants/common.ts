import {OidcParams, SberVisorProps} from 'sberid-js-sdk';

export const oidcParams: OidcParams = {
    response_type: 'code',
    client_type: 'PRIVATE',
    client_id: '3BA14915-C78C-F687-77C0-71784F4797B1',
    state: 'ut8Ar4MUZEMDPIiD2ko914y37s0Q0VKJgxeCkU0yzTY',
    redirect_uri: 'http://sbt-oafs-754:9080/WebTestApp/oidc/requestToken.do',
    scope: 'openid name',
    nonce: 'NfZscgwxPY7v0kYvuPfnFHA57bqHxQc3lV51Oiaxlo4',
    authApp: 'sbol',
};

export const sa: SberVisorProps = {
    enable: false,
    init: 'auto',
    clientId: '3BA14915-C78C-F687-77C0-71784F4797B1',
    clientName: 'ООО Ромашка',
};

export const baseUrl = 'https://ift-csa.testonline.sberbank.ru:4456';
