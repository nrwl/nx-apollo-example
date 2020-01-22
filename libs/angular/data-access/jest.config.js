module.exports = {
  name: 'angular-data-access',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/angular/data-access',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
