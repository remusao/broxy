declare module 'browser-core' {

  type moduleNames = 'core';

  interface ICliqzModule {
    name: string;
    background: {};
    action: (name: string, ...args: any) => Promise;
  }

  interface IProxyPeerModule extends ICliqzModule {
    background: {
      proxyPeer: any;
    };
  }

  interface IWebrequestPipelineModule extends ICliqzModule {
    background: {
      [webRequestEvent: string]: () => Promise<any>;
    };
  }

  export class App {
    public moduleList: ICliqzModule[];
    public modules: {
      public [name in moduleNames]: ICliqzModule;
      public 'webrequest-pipeline': IWebrequestPipelineModule;
      public 'proxy-peer': IProxyPeerModule;
    };
    public start(): Promise;
  }
}
