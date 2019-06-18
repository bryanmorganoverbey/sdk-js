const { execSync } = require('child_process');

module.exports = plop => {
  plop.setHelper('userFullName', () => {
    const name = execSync(
      'git config --global --includes user.name'
    ).toString();
    return name.replace(/\n$/, '').trim();
  });

  plop.setHelper('userEmail', () => {
    const email = execSync(
      'git config --global --includes user.email'
    ).toString();
    return email.replace(/\n$/, '').trim();
  });

  plop.setGenerator('package', {
    description: 'Create new package in monorepo',
    prompts: [
      {
        type: 'input',
        name: 'packageName',
        message: 'package name',
      },
      {
        type: 'input',
        name: 'packageDescription',
        message: 'package description',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/{{kebabCase packageName}}/{{kebabCase packageName}}.js',
        templateFile: 'plop-templates/library/main.js.hbs',
      },
      {
        type: 'add',
        path:
          'packages/{{kebabCase packageName}}/{{kebabCase packageName}}.test.js',
        templateFile: 'plop-templates/library/main.test.js.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase packageName}}/package.json',
        templateFile: 'plop-templates/library/package.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase packageName}}/README.md',
        templateFile: 'plop-templates/library/README.md.hbs',
      },
    ],
  });

  plop.setGenerator('api resource', {
    description: 'Create new api resource',
    prompts: [
      {
        type: 'input',
        name: 'resourceName',
        message: 'resource name',
      },
      {
        type: 'confirm',
        name: 'isMicroservice',
        message: 'Is this resource for a microservice?',
        default: false,
      },
    ],
    actions: data => {
      const actions = [
        {
          type: 'add',
          path: 'packages/api-angular/src/{{camelCase resourceName}}.js',
          templateFile: 'plop-templates/resource/api-angular-resource.js.hbs',
        },
        {
          type: 'add',
          path: 'packages/api-axios/src/{{camelCase resourceName}}.js',
          templateFile: 'plop-templates/resource/api-axios-resource.js.hbs',
        },
        {
          type: 'add',
          path:
            'packages/api-core/src/resources/tests/{{camelCase resourceName}}.test.js',
          templateFile: 'plop-templates/resource/api-core-test.js.hbs',
        },
      ];

      if (data.isMicroservice) {
        actions.push({
          type: 'add',
          path: 'packages/api-core/src/resources/{{camelCase resourceName}}.js',
          templateFile: 'plop-templates/resource/api-core-ms-resource.js.hbs',
        });
      } else {
        actions.push({
          type: 'add',
          path: 'packages/api-core/src/resources/{{camelCase resourceName}}.js',
          templateFile: 'plop-templates/resource/api-core-resource.js.hbs',
        });
      }

      return actions;
    },
  });
};
