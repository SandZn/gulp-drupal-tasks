<?php

class BaseUrlTest extends \PHPUnit_Framework_TestCase {

  public function testBaseUrl() {
    $this->assertEquals('foo', getenv('SIMPLETEST_BASE_URL'));
  }
}