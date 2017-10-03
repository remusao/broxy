const fs = require('fs');
const path = require('path');
const ts = require('typescript');


const typeScriptToElmType = {
  [ts.SyntaxKind.BooleanKeyword]: 'Bool',
  [ts.SyntaxKind.StringKeyword]: 'String',
  [ts.SyntaxKind.NumberKeyword]: 'Int',
};


const reverse = {};
Object.keys(ts.SyntaxKind).forEach(name => {
  reverse[ts.SyntaxKind[name]] = name;
});


function convertType(node) {
  const kind = node.kind;
  // Deal with primitive data types
  if (kind === ts.SyntaxKind.BooleanKeyword ||
      kind === ts.SyntaxKind.StringKeyword ||
      kind === ts.SyntaxKind.NumberKeyword) {
    return typeScriptToElmType[kind];
  }

  // Deal with composite data types

  if (kind === ts.SyntaxKind.TupleType) {
    const elementTypes = node.elementTypes.map(convertType);
    return `(${elementTypes.join(', ')})`;
  }

  if (kind === ts.SyntaxKind.ArrayType) {
    return `List ${convertType(node.elementType)}`;
  }

  if (kind === ts.SyntaxKind.JSDocNullableType) {
    return `Maybe ${convertType(node.type)}`;
  }

  return 'JEncode.Value';
}


function generateElmDeclaration(types) {
  const results = [
    'module Types exposing (..)',
    'import Json.Encode as JEncode',
  ];

  types.forEach(({name, members}) => {
    let declaration = `type alias ${name} = \n  {`;
    declaration += members.map(({ field, type }) => ` ${field} : ${type}`).join('\n  ,');
    //   declaration += `, ${field} : ${type}\n  `;
    // });
    declaration += '\n  }';
    results.push(declaration);
  });

  return results.join('\n\n');
}


function generateElmFromInterfaces(source) {
  const types = [];
  const nodes = [source];

  while (nodes.length > 0) {
    const node = nodes.splice(0, 1)[0];
    const kind = node.kind;
    if (kind === ts.SyntaxKind.InterfaceDeclaration) {
      const name = node.name.escapedText;
      const members = [];
      node.members.forEach(member => {
        members.push({
          field: member.name.escapedText,
          type: convertType(member.type),
        });
      });
      types.push({
        name,
        members,
      });
    } else {
      ts.forEachChild(node, (child) => {
        nodes.push(child);
      });
    }
  }

  return generateElmDeclaration(types);
}


function convert(inputFile, outputFile, callback) {
  fs.readFile(inputFile, 'utf8', (readErr, data) => {
    if (readErr) {
      callback(err);
    } else {
      try {
        const parsedSource = ts.createSourceFile(
          inputFile,
          data,
          ts.ScriptTarget.ES6,
          /*setParentNodes */ false,
        );
        const elmDeclaration = generateElmFromInterfaces(parsedSource);
        fs.writeFile(outputFile, elmDeclaration, 'utf8', callback);
      } catch (ex) {
        callback(ex);
      }
    }
  });
}


function main() {
  const argv = process.argv;
  if (argv.length > 2) {
    const inputFile = argv[2];
    const outputFile = path.join(argv[3], 'Types.elm');

    if (!inputFile.endsWith('.ts')) {
      console.error('First argument should be a Typescript source file');
      console.error('> Given:', inputFile);
    } else {
      console.log('Generate Elm type from typescript interfaces...');
      console.log('> Input file:', inputFile);
      console.log('> Output file:', outputFile);

      convert(inputFile, outputFile, (err) => {
        if (err) {
          console.error('Error while generating Elm types', err);
        } else {
          console.log('Generation successful!');
        }
      });
    }
  }
}


main();
