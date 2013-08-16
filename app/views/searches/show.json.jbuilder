representation = params[:representation]
animation = params[:animation]

if representation == "highcharts"
	render_json_for_highcharts(json,animation)
elsif representation == "maps"
	render_json_for_maps json
elsif representation == "globe"
	render_json_for_globe json
end



