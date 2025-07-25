const { exec, spawn } = require('child_process');
const path = require('path');
// const { stderr } = require('process');

const fs = require('fs');
const { v4: uuid } = require('uuid')

var axios = require("axios");
var qs = require("qs");

// --------------------------Makiing the checking files--------------------------------------

const dirCodes = path.join(__dirname, "test-codes")
//to make a file if codes file doesnt exust
if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true })
} else {
    console.log("test-codes folder does exist")
}

// -----------------------------------Python--------------------------------------
const executePy = async (filepath) => {
    const name = path.basename(filepath)
    let runCommand;
    runCommand = `python api/test-codes/${name} `
    // runCommand = `python test-codes/${name} `

    
    console.log(__dirname)


    return new Promise((resolve, reject) => {
        exec(runCommand, (err, stdout, stderr) => {
            if (err)
                reject({ err, stderr });
            else if (stderr)
                reject({ stderr });
            stdout = stdout.replaceAll('\r', '')
            stdout = stdout.substring(0, stdout.length - 1)
            resolve(stdout);
        })

    })


};

function arrayToStringPy(arr, i = 0) {
    let s = "["
    arr.forEach((el) => {
        if (Array.isArray(el) === true)
            s = s + arrayToStringPy(el, i + 1)
        else
            s = s + el + ','
    })
    s = s.substring(0, s.length - 1) + "],"
    if (i == 0)
        s = s.substring(0, s.length - 1)
    return s
}

const processCodePy = async (codeMain, input, parameterTypes, funcName) => {

    console.log(input)
    codeMain = "import sys\n" + codeMain
    let code = `\nprint(${funcName}(`;
    // writing the function call signature with the parameter names- 
    // this piece of code is placed at the end of thepython file
    // here the code variable is for the function call line
    let index = 0


    parameterTypes.forEach((type) => {
        if (type === 'String') {
            let param = input[index]
            code = code + `'${param}',`
            index += 1
        }
        else if (type === 'Integer') {
            let param = input[index]
            code = code + `${param},`
            index += 1

        }
        else if (type === 'Boolean') {
            let param = input[index] == "true" ? 'True' : 'False'
            code = code`${param},`
            index += 1
        }
        else if (type === 'StringArray') {
            code = code + arrayToStringJS(string = true, input[index])
        }
        else if (type === 'IntegerArray') {
            code = code + arrayToStringJS(string = false, input[index])
        } else if (type === 'BooleanArray') {
            code = code + arrayToStringJS(string = false, input[index])
        }
    })

    code = parameterTypes.length === 0 ? code : code.substring(0, code.length - 1)
    code = code + "))"
    codeMain = codeMain + code;
    return codeMain;
}

const generateFilePy = async (format, code) => {
    //here parameters is used for the parameter length
    const jobId = uuid()
    const filename = `${jobId}.${format}`
    const filepath = path.join(dirCodes, filename)

    await fs.writeFileSync(filepath, code);

    return filepath
};
const runAnswerPy = async ({ language, data }) => {
    return new Promise(async (resolve, reject) => {
        let check = false
        let output;
        let err;
        let filepath
        const {
            code,
            funcName,
            parameterTypes,
            customInput
        } = data
        try {
            let processedCode = await processCodePy(code, customInput, parameterTypes, funcName)
            filepath = await generateFilePy(language, processedCode)
            try {
                output = await executePy(filepath)
                console.log('out', output)
                check = true
            } catch ({ stderr }) {
                output = stderr
                check = true
            }
        } catch (error) {
            console.log(error)
            err = error
            check = false
        }
        fs.unlink(filepath, (er) => {
            if (er) { err = er; check = false }
        })
        if (check === false) {
            reject({ success: false, error: err })
        } else if (check === true) {
            resolve({ success: true, output })
        }
    })
}
// -----------------------------------Python--------------------------------------
// -----------------------------------JavaScript--------------------------------------
const runAnswerJS = async ({ language, data }) => {
    return new Promise(async (resolve, reject) => {
        let check = false
        let output;
        let err;
        let filepath
        const {
            code,
            funcName,
            parameterTypes,
            customInput
        } = data
        try {
            let processedCode = await processCodeJS(code, customInput, parameterTypes, funcName)
            filepath = await generateFileJS(language, processedCode)
            try {
                output = await executeJS(filepath)
                console.log('out', output)
                check = true
            } catch ({ stderr }) {
                output = stderr
                check = true
            }
        } catch (error) {
            console.log(error)
            err = error
            check = false
        }
        fs.unlink(filepath, (er) => {
            if (er) { err = er; check = false }
        })
        if (check === false) {
            reject({ success: false, error: err })
        } else if (check === true) {
            resolve({ success: true, output })
        }
    })
}
function arrayToStringJS(string, arr, i = 0) {
    let s = "["
    arr.forEach((el) => {
        if (Array.isArray(el) === true)
            s = s + arrayToStringJS(el, i + 1)
        else
            if (string === false) {
                s = s + el + ','
            } else {
                s = s + `"${el}"` + ','
            }
    })
    s = s.substring(0, s.length - 1) + "],"
    if (i == 0)
        s = s.substring(0, s.length - 1) + ','
    return s
}
const executeJS = async (filepath) => {
    const name = path.basename(filepath)
    let runCommand;
    // runCommand = `node api/test-codes/${name} `
    runCommand = `node test-codes/${name} `
    console.log('going to run the command right now')
    console.log('going to run the command right now')
    return new Promise((resolve, reject) => {
        exec(runCommand, (err, stdout, stderr) => {
            if (err)
                reject({ err, stderr });
            else if (stderr)
                reject({ stderr });
            stdout = stdout.replaceAll('\r', '')
            stdout = stdout.substring(0, stdout.length - 1)
            resolve(stdout);
        })

    })


};
const processCodeJS = async (codeMain, input, parameterTypes, funcName) => {
    console.log(input)
    let code = `\nconsole.log(${funcName}(`;
    // writing the function call signature with the parameter names- 
    // this piece of code is placed at the end of thepython file
    // here the code variable is for the function call line
    let index = 0


    parameterTypes.forEach((type, ind) => {
        if (type === 'String') {
            let param = input[index]
            code = code + `'${param}',`
            index += 1
        }
        else if (type === 'Integer') {
            let param = input[index]
            code = code + `${param},`
            index += 1

        }
        else if (type === 'Boolean') {
            let param = input[index] == "true" ? 'true' : 'false'
            code = code`${param},`
            index += 1
        }
        else if (type === 'StringArray') {
            code = code + arrayToStringJS(string = true, input[ind])
        }
        else if (type === 'IntegerArray') {
            code = code + arrayToStringJS(string = false, input[ind])
        } else if (type === 'BooleanArray') {
            code = code + arrayToStringJS(string = false, input[ind])
        }
    })
    code = parameterTypes.length === 0 ? code : code.substring(0, code.length - 1)
    code = code + "))"
    codeMain = codeMain + code;
    return codeMain;
}

const generateFileJS = async (format, code) => {
    //here parameters is used for the parameter length
    const jobId = uuid()
    const filename = `${jobId}.${format}`
    const filepath = path.join(dirCodes, filename)

    await fs.writeFileSync(filepath, code);

    return filepath
};


// -----------------------------------JavaScript--------------------------------------
// -----------------------------------Java--------------------------------------

const runAnswerJava = async ({ language, data }) => {
    return new Promise(async (resolve, reject) => {
        let check = false
        let output;
        let err;
        let filepath
        const {
            code,
            funcName,
            parameterTypes,
            customInput
        } = data
        try {
            let processedCode = await processCodeJS(code, customInput, parameterTypes, funcName)
            // console.log('processed code', processedCode)
            filepath = await generateFileJS(language, processedCode)
            // console.log('filepath', filepath)
            try {
                output = await executeJS(filepath)
                console.log('out', output)
                check = true
            } catch ({ stderr }) {
                output = stderr
                check = true
            }
        } catch (error) {
            console.log(error)
            err = error
            check = false
        }
        fs.unlink(filepath, (er) => {
            if (er) { err = er; check = false }
        })
        if (check === false) {
            reject({ success: false, error: err })
        } else if (check === true) {
            resolve({ success: true, output })
        }
    })
}
function arrayToStringJava(arr, i = 0) {
    let s = "{"
    arr.forEach((el) => {
        if (Array.isArray(el) === true)
            s = s + arrayToStringJS(el, i + 1)
        else
            if (string === false) {
                s = s + el + ','
            } else {
                s = s + `"${el}"` + ','
            }
    })
    s = s.substring(0, s.length - 1) + "},"
    if (i == 0)
        s = s.substring(0, s.length - 1) + ','
    return s
}
const createJava = async (filepath) => {
    const name = path.basename(filepath)
    // let runCommand = `javac api/test-codes/${name}.java `
    let runCommand = `node --version `


    return new Promise((resolve, reject) => {
        exec(runCommand, (err, stdout, stderr) => {
            if (err)
                reject({ err, stderr });
            else if (stderr)
                reject({ stderr });

            resolve();
        })

    })


};
const runJava = async (filepath) => {
    const name = path.basename(filepath)
    let runCommand = `cd api/test-codes && java ${name} `


    return new Promise((resolve, reject) => {
        exec(runCommand, (err, stdout, stderr) => {
            if (err)
                reject({ err, stderr });
            else if (stderr)
                reject({ stderr });
            stdout = stdout.replaceAll('\r', '')
            stdout = stdout.substring(0, stdout.length - 1)
            resolve(stdout);
        })

    })
}
const processCodeJava = async (codeMain, input, parameterTypes, funcName, jobId) => {
    // const jobId = uuid()

    // let code = `\nclass ${jobId}{
    let code = `public static void main(String[] args){
    System.out.println(${funcName}(`;
    // writing the function call signature with the parameter names- 
    // this piece of code is placed at the end of thepython file
    // here the code variable is for the function call line
    let index = 0


    parameterTypes.forEach((type) => {
        if (type === 'String') {
            let param = input[index]
            code = code + `"${param}",`
            index += 1
        }
        else if (type === 'Integer') {
            let param = input[index]
            code = code + `${param},`
            index += 1

        }
        else if (type === 'Boolean') {
            let param = input[index] == "true" ? 'true' : 'false'
            code = code`${param},`
            index += 1
        }
        else if (type === 'StringArray') {
            code = code + arrayToStringJava(input[index])
        }
        else if (type === 'IntegerArray') {
            code = code + arrayToStringJava(input[index])
        }
        else if (type === 'BooleanArray') {
            code = code + arrayToStringJava(input[index])
        }
    })

    code = parameterTypes.length === 0 ? code : code.substring(0, code.length - 1)
    code = code + "));" + `
    }
`
    codeMain = `public class MyClass{
`+ codeMain+`
`+code + `
}`
    return codeMain;
}

const executeJava = async (code) => {
    //here parameters is used for the parameter length

    return new Promise((resolve, reject) => {
        var data = qs.stringify({
            code,
            language: "java",
            input: "",
        });
        var config = {
            method: "post",
            url: "https://api.codex.jaagrav.in",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
        };

        axios(config)
            .then(function (response) {
                console.log(response.data)
                if (response.data.success === true) {
                    let out = response.data.output
                    resolve(out.substring(0,out.length-1));
                } else {
                    resolve(JSON.stringify(response.data.error));
                }
            })
            .catch(function (error) {
                console.log("errror has arrived while executing Java code", error)
                reject(error);
            });
    })
};

// -----------------------------------Java--------------------------------------

const checkAnswerPy = async ({ language, data }) => {
    return new Promise(async (resolve, reject) => {
        const {
            code,
            funcName,
            parameterNames,
            parameterTypes,
            testCases
        } = data
        console.log(data)
        let report = []
        // console.log(typeof (report))
        let check = true;
        let files = []

        for (let index = 0; index < testCases.length; index++) {
            let tc = testCases[index]
            // console.log('first')
            const { input, output } = tc;
            console.log(tc)
            console.log(index, input)
            let processedCode = '';
            try {
                let filepath;
                switch (language) {
                    case 'py':
                        processedCode = await processCodePy(code, input, parameterTypes, funcName)
                        // console.log('processed code', processedCode)
                        filepath = await generateFilePy(language, processedCode)
                        break;
                    case 'js':
                        processedCode = await processCodeJS(code, input, parameterTypes, funcName)
                        // console.log('processed code', processedCode)
                        filepath = await generateFileJS(language, processedCode)
                        break;
                    case 'java':
                        let jobId = uuid()
                        processedCode = await processCodeJava(code, input, parameterTypes, funcName, jobId)

                        break;

                   
                }



                files.push(filepath)
                let correct = false
                try {
                    let out;

                    if (language === 'py') {
                        out = await executePy(filepath)

                    } else if (language === 'js') {
                        out = await executeJS(filepath)
                    }
                    else if (language === 'java') {
                        out = await executeJava(processedCode)
                        console.log(out)
                        // await runJava(filepath)
                    }
                   
                    let out_parsed
                    let output_parsed
                    try {
                        out_parsed = JSON.parse(out.replaceAll("'", "\""))
                        output_parsed = JSON.parse(output.replaceAll("'", "\""))
                    } catch (parseError) {
                        console.log("]]]", parseError)
                    }
                    let out_copy = '' + out
                    if (output.indexOf("[") !== -1 && output.indexOf("]") !== -1) {
                        console.log("familiar", out)
                        try {
                            let equal = true
                           
                            correct = JSON.stringify(output_parsed.sort()) === JSON.stringify(out_parsed.sort())

                        } catch (parseError) {
                            console.log(parseError)
                        }

                    } else {
                        if (out === output) {
                            correct = true;
                        }
                    }

                    let subRep;
                    report.push({
                        case: index,
                        yourOutput: out_copy,
                        reqOutput: output,
                        correct
                    })


                    check = true
                } catch ({ stderr }) {
                    report.push({
                        case: index,
                        yourOutput: stderr,
                        reqOutput: output,
                        correct
                    })

                    check = true
                }
            } catch (processError) {
                check = false
            }

        }
       
        if (check === false) {
            reject({ success: false })
        } else if (check === true) {
            resolve({ success: true, report })
        }

    })


}

module.exports = {
    checkAnswerPy,
    runAnswerPy
}