<?php

class GoodTest extends \PHPUnit_Framework_TestCase {

  public function testIt() {
    $this->assertTrue(TRUE);
  }

  /**
   * @group grouped
   */
  public function testGroup() {
    $this->assertTrue(TRUE);
  }
}