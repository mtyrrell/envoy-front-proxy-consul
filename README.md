# envoy-front-proxy-consul
Example of Envoy as a front-proxy for a Consul service registry

## Start

```
docker-compose up
```

## Test

```
curl localhost -H "Host: echo"
```

## Debug xDS output

```
docker ps
docker exec {rotor CONTAINER ID} rotor-test-client
```
### Example xDS

```json
cds: {
  "versionInfo": "EoCIfxyqbpuJPpX/bCbg/w==",
  "resources": [
    {
      "@type": "type.googleapis.com/envoy.api.v2.Cluster",
      "name": "echo",
      "type": "EDS",
      "edsClusterConfig": {
        "edsConfig": {
          "apiConfigSource": {
            "apiType": "GRPC",
            "grpcServices": [
              {
                "envoyGrpc": {
                  "clusterName": "tbn-xds"
                }
              }
            ],
            "refreshDelay": "30s"
          }
        },
        "serviceName": "echo"
      },
      "connectTimeout": "10s",
      "lbPolicy": "LEAST_REQUEST"
    }
  ],
  "typeUrl": "type.googleapis.com/envoy.api.v2.Cluster"
}
eds: {
  "versionInfo": "EoCIfxyqbpuJPpX/bCbg/w==",
  "resources": [
    {
      "@type": "type.googleapis.com/envoy.api.v2.ClusterLoadAssignment",
      "clusterName": "echo",
      "endpoints": [
        {
          "lbEndpoints": [
            {
              "endpoint": {
                "address": {
                  "socketAddress": {
                    "address": "172.29.0.3",
                    "portValue": 9090
                  }
                }
              },
              "healthStatus": "HEALTHY",
              "metadata": {
                "filterMetadata": {
                  "envoy.lb": {
                      "check:serfHealth": "passing",
                      "node-health": "passing",
                      "node-id": "60757da9e145",
                      "node:consul-network-segment": ""
                    }
                }
              }
            }
          ]
        }
      ]
    }
  ],
  "typeUrl": "type.googleapis.com/envoy.api.v2.ClusterLoadAssignment"
}
lds: {
  "versionInfo": "EoCIfxyqbpuJPpX/bCbg/w==",
  "resources": [
    {
      "@type": "type.googleapis.com/envoy.api.v2.Listener",
      "name": "default-cluster:80",
      "address": {
        "socketAddress": {
          "address": "0.0.0.0",
          "portValue": 80
        }
      },
      "filterChains": [
        {
          "filterChainMatch": {

          },
          "filters": [
            {
              "name": "envoy.http_connection_manager",
              "config": {
                  "access_log": [
                        {
                              "config": {
                                    "additional_request_headers_to_log": [
                                          "X-TBN-DOMAIN",
                                          "X-TBN-ROUTE",
                                          "X-TBN-RULE",
                                          "X-TBN-SHARED-RULES",
                                          "X-TBN-CONSTRAINT"
                                        ],
                                    "common_config": {
                                          "grpc_service": {
                                                "envoy_grpc": {
                                                      "cluster_name": "tbn-xds"
                                                    }
                                              },
                                          "log_name": "tbn.access"
                                        }
                                  },
                              "name": "envoy.http_grpc_access_log"
                            }
                      ],
                  "http_filters": [
                        {
                              "config": {
                                  },
                              "name": "envoy.cors"
                            },
                        {
                              "config": {
                                    "upstream_log": [
                                          {
                                                "config": {
                                                      "additional_request_headers_to_log": [
                                                            "X-TBN-DOMAIN",
                                                            "X-TBN-ROUTE",
                                                            "X-TBN-RULE",
                                                            "X-TBN-SHARED-RULES",
                                                            "X-TBN-CONSTRAINT"
                                                          ],
                                                      "common_config": {
                                                            "grpc_service": {
                                                                  "envoy_grpc": {
                                                                        "cluster_name": "tbn-xds"
                                                                      }
                                                                },
                                                            "log_name": "tbn.upstream"
                                                          }
                                                    },
                                                "name": "envoy.http_grpc_access_log"
                                              }
                                        ]
                                  },
                              "name": "envoy.router"
                            }
                      ],
                  "rds": {
                        "config_source": {
                              "api_config_source": {
                                    "api_type": "GRPC",
                                    "grpc_services": [
                                          {
                                                "envoy_grpc": {
                                                      "cluster_name": "tbn-xds"
                                                    }
                                              }
                                        ],
                                    "refresh_delay": "30s"
                                  }
                            },
                        "route_config_name": "default-cluster:80"
                      },
                  "stat_prefix": "default-cluster-80"
                }
            }
          ]
        }
      ]
    }
  ],
  "typeUrl": "type.googleapis.com/envoy.api.v2.Listener"
}
rds: {
  "versionInfo": "EoCIfxyqbpuJPpX/bCbg/w==",
  "resources": [
    {
      "@type": "type.googleapis.com/envoy.api.v2.RouteConfiguration",
      "name": "default-cluster:80",
      "virtualHosts": [
        {
          "name": "echo-80",
          "domains": [
            "echo",
            "echo:80"
          ],
          "routes": [
            {
              "match": {
                "prefix": "/",
                "caseSensitive": false
              },
              "route": {
                "weightedClusters": {
                  "clusters": [
                    {
                      "name": "echo",
                      "weight": 1,
                      "metadataMatch": {

                      },
                      "requestHeadersToAdd": [
                        {
                          "header": {
                            "key": "x-tbn-constraint"
                          },
                          "append": false
                        }
                      ]
                    }
                  ],
                  "totalWeight": 1
                },
                "timeout": "60s",
                "retryPolicy": {
                  "retryOn": "connect-failure,refused-stream,gateway-error",
                  "numRetries": 2,
                  "perTryTimeout": "60s"
                },
                "requestHeadersToAdd": [
                  {
                    "header": {
                      "key": "x-tbn-route",
                      "value": "echo:80/"
                    },
                    "append": false
                  },
                  {
                    "header": {
                      "key": "x-tbn-rule",
                      "value": "DEFAULT"
                    },
                    "append": false
                  },
                  {
                    "header": {
                      "key": "x-tbn-shared-rules",
                      "value": "DEFAULT"
                    },
                    "append": false
                  }
                ]
              }
            }
          ],
          "requestHeadersToAdd": [
            {
              "header": {
                "key": "x-tbn-domain",
                "value": "echo:80"
              },
              "append": false
            }
          ]
        }
      ]
    }
  ],
  "typeUrl": "type.googleapis.com/envoy.api.v2.RouteConfiguration"
}
```
