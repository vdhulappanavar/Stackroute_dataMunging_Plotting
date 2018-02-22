var headings=[];
var age_group_index=0;
var Literate_persons =0;
var Education_Category_indexs = new Array()
var Education_Category_dict = []
var Education_Category_heading = new Array()
var age_map_dict={} ;
var file_no =0;
var csv_to_read = [ "./India2011.csv" , "./IndiaSC2011.csv" , "./IndiaST2011.csv" ]

function get_education_category_values(headings)
{
    for(i=0;i<headings.length;i++){
        var heading_components = headings[i].split("-");
        if((heading_components[0]).trim().localeCompare("Educational level")==0){
            if(heading_components.length>3){ 
                heading_components = heading_components.slice( 1 , heading_components.length-1)
                if(!(heading_components.join(" - ") in Education_Category_dict)){
                    Education_Category_dict[heading_components.join(" - ")] = 0;
                    Education_Category_heading.push(heading_components.join(" - "))
                }
            }
            else if(!(heading_components[1] in Education_Category_dict))
            {
                Education_Category_heading.push(heading_components[1])
                Education_Category_dict[heading_components[1]] = 0;
            }
            Education_Category_indexs.push(i)
            i=i+2
        }
    } 
}

function consolidate_data(line){
    
        data_line = line.split(",");
        if(!(data_line[age_group_index] in age_map_dict))
        {
            age_map_dict[data_line[age_group_index]]=parseInt(data_line[Literate_persons]);
        }
        else{
            age_map_dict[data_line[age_group_index]] += parseInt(data_line[Literate_persons]);
        }
        for(j in Education_Category_heading){
            Education_Category_dict[Education_Category_heading[j]]+= parseInt(data_line[Education_Category_indexs[j]])
        }
}


function get_heading_values(line){
    headings = line.split(",");
    age_group_index = headings.indexOf("Age-group");
    Literate_persons = headings.indexOf("Literate - Persons");
    get_education_category_values(headings)
}

function write_age_map_json(){
    var fs = require('fs');
    const age_map_file = fs.createWriteStream('./age_map.json');
    age_map_file.write("[\n");
    //console.log(age_map_dict.length)
    is_first_entery = true;
    for(i in age_map_dict){
        if(is_first_entery){
            age_map_file.write('{\n\t"age_group" : "'+i+'",\n\t"number" : '+age_map_dict[i]+'}\n');
            is_first_entery = !is_first_entery;
        }
        else
            age_map_file.write(',{\n\t"age_group" : "'+i+'",\n\t"number" : '+age_map_dict[i]+'}\n')
    }
    age_map_file.write("]\n");
    age_map_file.end();
}

function write_education_category(){
    is_first_entery = true;
    var fs = require('fs');
    const education_category_file = fs.createWriteStream('./education_category.json');
    education_category_file.write("[\n");
    for(i in Education_Category_dict){
        if(is_first_entery){
            education_category_file.write('{\n\t"Education_Category" : "'+i+'",\n\t"number" : '+Education_Category_dict[i]+'\n}\n');
            is_first_entery = !is_first_entery
        }
            else
            education_category_file.write(',{\n\t"Education_Category" : "'+i+'",\n\t"number" : '+Education_Category_dict[i]+'\n}\n');
    }
    education_category_file.write("]\n");
    education_category_file.end();
}


function read_async(file_num=0){
    function main(line){
        if(isheading){
            
            
            if(file_no==0)
                get_heading_values(line)
            isheading = false;
        }
        else{
            consolidate_data(line);
        } 
    }

    
    var isheading = true;
    var fs = require('fs');
    var readline = require('readline');
    var stream = require('stream');
    //var instream = fs.createReadStream('./india2011.csv');
    var instream = fs.createReadStream(csv_to_read[file_num]);
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);
    rl.on('line', function (line) {
        

        main(line)
    });
    rl.on('close', function (line) {
        file_no++;
        
        
        //isheading = true;
        if(file_no==3)
        {
            console.log("to write")
            write_age_map_json();
             write_education_category();
        }
    });
}
read_async(0)
read_async(1)
read_async(2)
