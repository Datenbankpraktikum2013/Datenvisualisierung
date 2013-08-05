representation = params[:representation]

if representation == "highcharts"
	render_json_for_highcharts json
elsif representation == "maps"
	render_json_for_maps json
end



