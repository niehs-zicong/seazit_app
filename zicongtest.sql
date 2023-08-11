SELECT "mvw_seazit_bmc_result"."protocol_id",
       "mvw_seazit_bmc_result"."endpoint_name",
       "mvw_seazit_bmc_result"."casrn",
       "mvw_seazit_bmc_result"."preferred_name",
       "mvw_seazit_bmc_result"."use_category1",
       "mvw_seazit_bmc_result"."dtxsid",
       "mvw_seazit_bmc_result"."min_pod_med",
       "mvw_seazit_bmc_result"."med_pod_med",
       "mvw_seazit_bmc_result"."max_pod_med",
       "mvw_seazit_bmc_result"."med_hitconf",
       "mvw_seazit_bmc_result"."n_values",
       "mvw_seazit_bmc_result"."mort_min_pod_med",
       "mvw_seazit_bmc_result"."mort_med_pod_med",
       "mvw_seazit_bmc_result"."mort_max_pod_med",
       "mvw_seazit_bmc_result"."mort_med_hitconf",
       "mvw_seazit_bmc_result"."mort_n_values",
       "mvw_seazit_bmc_result"."min_lowest_conc",
       "mvw_seazit_bmc_result"."max_highest_conc",
       "mvw_seazit_bmc_result"."mean_pod",
       "mvw_seazit_bmc_result"."mean_selectivity",
       "mvw_seazit_bmc_result"."med_mort_hit_confidence",
       "mvw_seazit_bmc_result"."n_rep_max_dev_call",
       "mvw_seazit_bmc_result"."n_rep",
       "mvw_seazit_bmc_result"."f_max_dev_call",
       "mvw_seazit_bmc_result"."final_dev_call",
       "mvw_seazit_bmc_result"."malformation",
       "mvw_seazit_bmc_result"."combin_ontology",
       "mvw_seazit_bmc_result"."combin_ontology_id",
       "mvw_seazit_bmc_result"."endpoint_name_protocol",
       "mvw_seazit_bmc_result"."lab_anonymous_code",
       "mvw_seazit_bmc_result"."test_condition",
       "mvw_seazit_bmc_result"."protocol_name_long",
       "mvw_seazit_bmc_result"."protocol_name_plot"
FROM schema_seazit.mvw_seazit_bmc_result

WHERE ("mvw_seazit_bmc_result"."protocol_id" IN (9) AND
       "mvw_seazit_bmc_result"."endpoint_name_protocol" IN ('MalformedAny+Mort@120_9'))

       WHERE ("mvw_seazit_bmc_result"."protocol_id" IN (1) AND
       "mvw_seazit_bmc_result"."endpoint_name_protocol" IN ('MalformedAny+Mort@120_1'))

WHERE
("mvw_seazit_bmc_result"."protocol_id" IN (9) AND
    "mvw_seazit_bmc_result"."endpoint_name" IN ('MalformedAny+Mort@120'))

WHERE (
       "mvw_seazit_bmc_result"."endpoint_name_protocol" IN ('MalformedAny+Mort@120_9'))
