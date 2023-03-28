#  WITH protocol_endpoint(protocol_id, endpoint_name, endpoint_name_only) AS (
#          SELECT analysis_bmc_input.protocol_id,
#             analysis_bmc_input.endpoint_name,
#             analysis_bmc_input.endpoint_name_only
#            FROM schema_seazit.analysis_bmc_input
#           GROUP BY analysis_bmc_input.protocol_id, analysis_bmc_input.endpoint_name, analysis_bmc_input.endpoint_name_only
#         ), endpoint_tb(protocol_name, protocol_source, seazit_protocol_id, study_phase, test_condition, protocol_name_long, protocol_name_plot, endpoint_name, endpoint_name_only, endpoint_name_protocol) AS (
#          SELECT seazit_protocol.protocol_name,
#             seazit_protocol.protocol_source,
#             seazit_protocol.seazit_protocol_id,
#             seazit_protocol.study_phase,
#             seazit_protocol.test_condition,
#             seazit_protocol.protocol_name_long,
#             seazit_protocol.protocol_name_plot,
#             protocol_endpoint.endpoint_name,
#             protocol_endpoint.endpoint_name_only,
#             (protocol_endpoint.endpoint_name || '_'::text) || seazit_protocol.seazit_protocol_id AS endpoint_name_protocol
#            FROM schema_seazit.seazit_protocol,
#             protocol_endpoint
#           WHERE protocol_endpoint.endpoint_name ~~ '%Mort%'::text AND seazit_protocol.seazit_protocol_id = protocol_endpoint.protocol_id
#         )
#  SELECT endpoint_tb.protocol_name,
#     endpoint_tb.protocol_source,
#     endpoint_tb.seazit_protocol_id,
#     endpoint_tb.study_phase,
#     endpoint_tb.test_condition,
#     endpoint_tb.protocol_name_long,
#     endpoint_tb.protocol_name_plot,
#     endpoint_tb.endpoint_name,
#     endpoint_tb.endpoint_name_only,
#     endpoint_tb.endpoint_name_protocol,
#     des.hour_post_fertilization,
#     des.endpoint_description
#    FROM endpoint_tb
#      LEFT JOIN schema_seazit.seazit_endpoint_description des ON endpoint_tb.protocol_source = des.protocol_source AND endpoint_tb.endpoint_name = des.endpoint_name;
#
#

## selection part

 WITH protocol_endpoint(protocol_id, endpoint_name, endpoint_name_only, endpoint_name_no_mort) AS (
         SELECT analysis_bmc_input.protocol_id,
            analysis_bmc_input.endpoint_name,
            analysis_bmc_input.endpoint_name_only,
            replace(analysis_bmc_input.endpoint_name_only, '+Mort'::text, ''::text) AS endpoint_name_no_mort
           FROM schema_seazit.analysis_bmc_input
          GROUP BY analysis_bmc_input.protocol_id, analysis_bmc_input.endpoint_name, analysis_bmc_input.endpoint_name_only
        ), endpoint_tb(protocol_name, protocol_source, seazit_protocol_id, study_phase, test_condition, protocol_name_long, protocol_name_plot, endpoint_name, endpoint_name_only, endpoint_name_protocol, endpoint_name_no_mort) AS (
         SELECT seazit_protocol.protocol_name,
            seazit_protocol.protocol_source,
            seazit_protocol.seazit_protocol_id,
            seazit_protocol.study_phase,
            seazit_protocol.test_condition,
            seazit_protocol.protocol_name_long,
            seazit_protocol.protocol_name_plot,
            protocol_endpoint.endpoint_name,
            protocol_endpoint.endpoint_name_only,
            (protocol_endpoint.endpoint_name || '_'::text) || seazit_protocol.seazit_protocol_id AS endpoint_name_protocol,
            protocol_endpoint.endpoint_name_no_mort
           FROM schema_seazit.seazit_protocol,
            protocol_endpoint
          WHERE protocol_endpoint.endpoint_name ~~ '%Mort%'::text AND seazit_protocol.seazit_protocol_id = protocol_endpoint.protocol_id
        )
 SELECT endpoint_tb.protocol_name,
    endpoint_tb.protocol_source,
    endpoint_tb.seazit_protocol_id,
    endpoint_tb.study_phase,
    endpoint_tb.test_condition,
    endpoint_tb.protocol_name_long,
    endpoint_tb.protocol_name_plot,
    endpoint_tb.endpoint_name,
    endpoint_tb.endpoint_name_only,
    endpoint_tb.endpoint_name_protocol,
    des.hour_post_fertilization,
    des.endpoint_description,
    onto.developmental_defect_grouping_granular,
    onto.developmental_defect_grouping_general
   FROM endpoint_tb
     LEFT JOIN schema_seazit.seazit_endpoint_description des ON endpoint_tb.protocol_source = des.protocol_source AND endpoint_tb.endpoint_name = des.endpoint_name
     LEFT JOIN schema_seazit.seazit_ontology onto ON endpoint_tb.protocol_source = onto.protocol_source AND endpoint_tb.endpoint_name_no_mort = onto.recording_name;


## query data part



