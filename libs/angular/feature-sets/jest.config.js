module.exports = {
  name: 'angular-feature-sets',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/angular/feature-sets',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
