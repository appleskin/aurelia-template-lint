
import {Linter, Rule} from 'template-lint';
import {SyntaxRule} from '../source/rules/syntax';
import {Reflection} from '../source/reflection';
import {ASTNode} from '../source/ast';

/* Triage - Make sure stuff doesn't blow-up for the time-being. */
describe("Triage", () => {

  it("it will silently ignore unknown converters", (done) => {
    let viewmodel = `
    export class Foo {
        value: string;
    }`
    let view = `
    <template>
      \${value | booboo}
    </template>`
    let reflection = new Reflection();
    let rule = new SyntaxRule(reflection);
    let linter = new Linter([rule]);
    reflection.add("./path/foo.ts", viewmodel);
    linter.lint(view, "./path/foo.html")
      .then((issues) => {
        expect(issues.length).toBe(0);
        done();
      })
  });

  it("it will silently ignore any-typed fields", (done) => {
    let viewmodel = `
    export class Foo {
        value: any;
    }`
    let view = `
    <template>
      \${value.not.checked}
    </template>`
    let reflection = new Reflection();
    let rule = new SyntaxRule(reflection);
    let linter = new Linter([rule]);
    reflection.add("./path/foo.ts", viewmodel);
    linter.lint(view, "./path/foo.html")
      .then((issues) => {
        expect(issues.length).toBe(0);
        done();
      })
  });

  it("it will silently ignore literal-typed fields", (done) => {
    let viewmodel = `
    export class Foo {
        value: {name:string};
    }`
    let view = `
    <template>
      \${value.not.checked}
    </template>`
    let reflection = new Reflection();
    let rule = new SyntaxRule(reflection);
    let linter = new Linter([rule]);
    reflection.add("./path/foo.ts", viewmodel);
    linter.lint(view, "./path/foo.html")
      .then((issues) => {
        expect(issues.length).toBe(0);
        done();
      })
  });

  it("it will silently ignore function-typed fields", (done) => {
    let viewmodel = `
    export class Foo {
        value: ()=>void;
    }`
    let view = `
    <template>
      \${value.not.checked}
    </template>`
    let reflection = new Reflection();
    let rule = new SyntaxRule(reflection);
    let linter = new Linter([rule]);
    reflection.add("./path/foo.ts", viewmodel);
    linter.lint(view, "./path/foo.html")
      .then((issues) => {
        expect(issues.length).toBe(0);
        done();
      })
  });

  //#58
  it("it will silently ignore access to untyped Array-object members", (done) => {
    let viewmodel = `
    export class Foo{
      items:[];
    }`
    let view = `
    <template>    
      \${items.length}
      \${items.lengh}
    </template>`
    let reflection = new Reflection();
    let rule = new SyntaxRule(reflection);
    let linter = new Linter([rule]);
    reflection.add("./foo.ts", viewmodel);
    linter.lint(view, "./foo.html")
      .then((issues) => {
        try {
          expect(issues.length).toBe(0);
          //expect(issues[0].message).toBe("cannot find 'lengh' in object 'Array'")
        }
        catch (err) { fail(err); }
        finally { done(); }
      })
  });
});