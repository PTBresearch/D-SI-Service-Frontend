export interface UnitModel {
  __inputUnit__: string;
  __metadata__: string;
  __permanent_identifier__: string;
  __rdf_representation__: string;
  __results_: string;
  __sirp_transformation__: string;
  input_unit: string;
  metadata: {
    ttl_representation: string;
  };
  permanent_identifier: {
    identifier: string;
  };
  rdf_representation: {
    sirp_metadata_triples: [string, string, string][];
  };
  results: {
    validSirpBoolean: boolean;
    valid_boolean: boolean;
    validation_output_human_message: string;
  };
  sirp_transformation: {
    sirp_syntax: string;
  };
}






// // metadata.interface.ts
// export interface Metadata {
//
//   inputUnit: string;
//   __metadata__: string;
//   __permanent_identifier__: string;
//   __rdf_representation__: string;
//   __results_: string;
//   __sirp_transformation__: string;
//   input_unit: string;
//   metadata: {
//     ttl_representation: string;
//   };
//   permanent_identifier: {
//     identifier: string;
//   };
//   rdf_representation: {
//     sirp_metadata_triples: [string, string, string][];
//   };
//   results: {
//     validSirpBoolean: boolean;
//     valid_boolean: boolean;
//     validation_output_human_message: string;
//   };
//   sirp_transformation: {
//     sirp_syntax: string;
//   };
// }
// export interface Metadata {
//   rdf_representation: {
//     sirp_metadata_triples: [string, string, string][];
//   };
//   metadata: {
//     ttl_representation: string;
//   };
// }
